import React, {useEffect, useState} from 'react';
import {Button, Input, Tooltip} from "antd";
import axios from "axios";

import StepCardInWaiting from "./components/stepCardInWaiting/StepCardInWaiting";
import {HeaderGroupContainer, HeaderTitle} from "../../../style/groupsStyles";
import {useGroupStatus} from "../../../hooks/useGroupStatus/useGroupStatus";
import Container from "../../../components/container/Container";
import StepCard from "./components/stepCard/StepCard";
import {handleApiError} from "../../../api/errors/apiErrorHandler";
import * as styled from "./SupervisionV2.styled";
import Table from "./components/table/Table";
import SideModal from "../../../components/SideModal/SideModal";

const statuses = [
    { id: 1, title: 'Groupe arrivé' },
    { id: 3, title: 'Groupe installé' },
    { id: 4, title: 'TM débutée' },
    { id: 5, title: 'TM terminée' },
];

function renderStatuses(statuses, currentStatus, currentGroup, onClick) {
    return statuses.map((status) => {
        const findItem = currentStatus?.find((findStatus) => findStatus?.status?.name === status.title);

        if (findItem) {
            return <StepCard status={status} />;
        } else {
            return <StepCardInWaiting currentGroup={currentGroup} status={status} onClick={onClick} />;
        }
    });
}

const SupervisionV2 = () => {
    const [currentGroup, setCurrentGroup] = React.useState({});
    const { currentStatus, updateStatus } = useGroupStatus(currentGroup.group_id);
    const [isShowModal, setIsShowModal] = useState(false);
    const [data, setData] = React.useState([]);
    const [radiosRenforts, setRadiosRenforts] = React.useState([]);
    const [meetingPoints, setMeetingPoints] = React.useState([]);

    const tmStatuses = statuses.filter((status) => status.title.includes('TM'));
    const otherStatuses = statuses.filter((status) => !status.title.includes('TM'));

    useEffect(() => {
        const date = new Date().toLocaleDateString(
            'fr-FR',
            { year: 'numeric', month: '2-digit', day: '2-digit' }
        );
        const fetchTrainData = async () => {
            try {
                const response = await axios.get('/api/train/day', {
                    params: { day: '08/07/2023' },
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                return response.data;
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchRadioData = async () => {
            try {
                const response = await axios.get('/api/radio/type/agent', {
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                return response.data;
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchMeetingPointData = async () => {
            try {
                const response = await axios.get('/api/meeting-point/', {
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                return response.data;
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchData = async () => {
            const [trainData, radioData, meetingPointData] = await Promise.all([fetchTrainData(), fetchRadioData(), fetchMeetingPointData()]);

            trainData.forEach(train => {
                train.train_groups.forEach(group => {
                    group.radioInfo = radioData.find(radio => radio.agentNumber === group?.group_planning?.agentNumber);
                });
            });

            setMeetingPoints(meetingPointData);
            setRadiosRenforts(radioData);
            setData(trainData);
        };

        fetchData();
    }, []);

    const handleClose = () => {
        setIsShowModal(false);
    };

    const onClick = async ( currentGroupId, statusId ) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_HOST}/api/group-status/${currentGroupId}/statuses/${statusId}`);
            const newStatus = { status: { name: statuses.find((s) => s.id === statusId).title } };
            updateStatus(newStatus);
            setData((prevData) =>
                prevData.map((train) => ({
                    ...train,
                    train_groups: train.train_groups.map((group) =>
                        group.group_id === currentGroup.group_id
                            ? {
                                ...group,
                                groupStatus: [...group.groupStatus, newStatus],
                            }
                            : group
                    ),
                }))
            );
        } catch (error) {
            handleApiError(error);
        }
    }

    return (
        <>
            <Container title={'supervision des groupes'}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'calc(100% - 100px)' }}>
                    <styled.Steps style={{ position: 'relative' }}>
                        <div style={{ position: 'sticky', top: '20px'}}>
                            <h3>Étapes du groupe : {currentGroup?.group_name}</h3>
                            {currentGroup && (
                                <>
                                    {renderStatuses(otherStatuses, currentStatus, currentGroup, onClick)}
                                    {
                                        currentGroup?.group_prestation && (
                                            <>
                                                <h3>Étapes TM</h3>
                                                {renderStatuses(tmStatuses, currentStatus, currentGroup, onClick)}
                                            </>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    </styled.Steps>
                    <styled.ListGroupContainer>
                        <HeaderGroupContainer>
                            <styled.CustomHeaderButton onClick={() => setIsShowModal(true)}>Radios</styled.CustomHeaderButton>
                        </HeaderGroupContainer>
                        <styled.ListGroups>
                            <>
                                {data.map((train) => (
                                    <styled.Train key={train.id}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <styled.TrainNumber>Train n°{train.train_number}</styled.TrainNumber>
                                            <styled.TrainNumber>{train.train_hour}</styled.TrainNumber>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <styled.TrainNumber>Voie {train.train_track}</styled.TrainNumber>
                                            </div>
                                        </div>
                                        <div>
                                            <Table data={train.train_groups} setCurrentGroup={setCurrentGroup} />
                                        </div>
                                    </styled.Train>
                                ))}
                            </>
                        </styled.ListGroups>
                    </styled.ListGroupContainer>
                </div>
            </Container>
            <SideModal isShowing={isShowModal} onClose={handleClose}>
                <h2>Liste des radios</h2>
                <div style={{ marginTop: '30px' }}>
                    <p>Radios des DPX</p>
                    <styled.Label>DEIDDA</styled.Label>
                    <styled.GroupValue>599586</styled.GroupValue>
                    <styled.Label>FOUET</styled.Label>
                    <styled.GroupValue>598266</styled.GroupValue>
                    <styled.Label>LHERBIER</styled.Label>
                    <styled.GroupValue>598528</styled.GroupValue>
                    <styled.Label>LENEVEU</styled.Label>
                    <styled.GroupValue>598271</styled.GroupValue>
                    <styled.Label>OTOVIC</styled.Label>
                    <styled.GroupValue>598009</styled.GroupValue>
                    <styled.Label>BEY BELMEHEL</styled.Label>
                    <styled.GroupValue>599554</styled.GroupValue>
                    <styled.Label>FARASSI</styled.Label>
                    <styled.GroupValue>113734</styled.GroupValue>
                    <styled.Label>MESSA OSPINA</styled.Label>
                    <styled.GroupValue>113723</styled.GroupValue>
                    <styled.Label>MARCHAL</styled.Label>
                    <styled.GroupValue>113713</styled.GroupValue>
                    <hr style={{ marginBottom: '20px' }} />
                    <p>Radios des renforts</p>
                    {radiosRenforts.map((radio) => (
                        <>
                            <styled.Label>RENFORT {radio.agentNumber}</styled.Label>
                            <styled.GroupValue>{radio.number}</styled.GroupValue>
                        </>
                    ))}
                    <hr style={{ marginBottom: '20px' }} />
                    <p>Radios des points</p>x
                    {meetingPoints.map((point) => (
                        <>
                            <styled.Label>POINT {point.name}</styled.Label>
                            <styled.GroupValue>{point?.radio?.number}</styled.GroupValue>
                        </>
                    ))}
                </div>
            </SideModal>
        </>
    );
};

export default SupervisionV2;
