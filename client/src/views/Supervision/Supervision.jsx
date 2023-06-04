import React, {useEffect} from 'react';
import Container from "../../components/container/Container";
import {HeaderGroupContainer, HeaderTitle} from "../../style/groupsStyles";
import * as styled from "./Supervision.styled";
import {Button, Input, Table} from "antd";
import axios from "axios";
import { BiCheck, BiLoaderAlt } from 'react-icons/bi';
import {handleApiError} from "../../helpers/api";

const statuses = [
    { id: 1, title: 'Groupe arrivé' },
    { id: 3, title: 'Groupe installé' },
    { id: 4, title: 'TM débutée' },
    { id: 5, title: 'TM terminée' },
];

function useGroupStatus(currentGroupId) {
    const [currentStatus, setCurrentStatus] = React.useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/group-status/${currentGroupId}/status`);
                setCurrentStatus(response.data);
            } catch (error) {
                console.error(error);
                setCurrentStatus([]);
            }
        };

        fetchStatus();
    }, [currentGroupId]);

    const updateStatus = (newStatus) => {
        setCurrentStatus((prevStatus) => [...prevStatus, newStatus]);
    };

    return { currentStatus, updateStatus };
}

const Supervision = () => {
    const [data, setData] = React.useState([]);
    const [currentGroup, setCurrentGroup] = React.useState({});
    const [trainTracks, setTrainTracks] = React.useState({});
    const { currentStatus, updateStatus } = useGroupStatus(currentGroup.group_id);

    useEffect(() => {
        const date = new Date().toLocaleDateString(
            'fr-FR',
            { year: 'numeric', month: '2-digit', day: '2-digit' }
        );
        console.log(date);
        const fetchData = async () => {
            try {
                const response = await axios.get('/group/list/date', {
                    params: { date: '22-04-2023' },
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                setData(response.data);
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchData();
    }, []);

    /*const updateTrainTrack = async (groupId) => {
        const trainTrack = trainTracks[groupId];
        if (!trainTrack) return;

        try {
            await axios.post(`http://localhost:3001/group/${groupId}/train-track`, { trainTrack });
        } catch (error) {
            handleApiError(error);
        }
    };*/

    const planningColumns = [
        {
            title: "Actions",
            key: "group_actions",
            render: (text, record) => (
                <>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            setCurrentGroup(record);
                        }}
                    >
                        Détails
                    </Button>
                </>
            ),
        },
        {
            title: "Groupe arrivé",
            key: "group_arrived",
            render: (text, record) => {
                return {
                    props: {
                        style: {
                            color: record?.groupStatus.find(findStatus => findStatus.status.name === 'Groupe arrivé') ? "#8ED984" : "#E85F4D",
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            textAlign: 'center'
                        },

                    },
                    children: <div>{record?.groupStatus.find(findStatus => findStatus.status.name === 'Groupe arrivé') ? "Terminé" : "En attente"}</div>
                };
            },
        },
        {
            title: "Groupe installé",
            key: "group_in_train",
            render: (text, record) => {
                return {
                    props: {
                        style: {
                            color: record?.groupStatus.find(findStatus => findStatus.status.name === 'Groupe installé') ? "#8ED984" : "#E85F4D",
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            textAlign: 'center'
                        },

                    },
                    children: <div>{record?.groupStatus.find(findStatus => findStatus.status.name === 'Groupe installé') ? "Terminé" : "En attente"}</div>
                };
            },
        },
        {
            title: "Heure de départ",
            dataIndex: ['group_train', 'train_hour'],
            key: "train_hour",
        },
        {
            title: "Numéro du train",
            dataIndex: ['group_train', 'train_number'],
            key: "train_number",
        },
        {
            title: "Voie",
            dataIndex: ['group_train', 'train_track'],
            key: "train_track",
            render: (text, record) => (
                <p>Pas renseigné</p>
            ),
        },
        {
            title: "Destination",
            dataIndex: "group_destination",
            key: "group_destination",
            width: 150,
        },
        { title: "Nom groupe", dataIndex: "group_name", key: "group_name", width: 240, },
        {
            title: "Total voyageurs",
            dataIndex: "group_total_travellers",
            key: "group_total_travellers",
        },
        {
            title: "N° Voiture",
            dataIndex: "group_car_number",
            key: "group_car_number",
        },
        { title: "Nature groupe", dataIndex: "group_type", key: "group_type", width: 140, },
        {
            title: "Prestation",
            dataIndex: "group_prestation",
            key: "group_prestation",
            render: (text) => text ? 'BAGTM' : 'NON'
        },
        {
            title: "Point RV",
            dataIndex: "group_meeting_point",
            key: "group_meeting_point",
        },
        {
            title: "Heure RV",
            dataIndex: "group_meeting_time",
            key: "group_meeting_time",
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.group_meeting_time?.replace('H', '') - b.group_meeting_time?.replace('H', ''),
        },
        {
            title: "Responsable JDD",
            dataIndex: "group_responsable_departure_day",
            key: "group_responsable_departure_day",
        },
        {
            title: "Tel. responsable JDD",
            dataIndex: "group_responsable_phone_departure_day",
            key: "group_responsable_phone_departure_day",
        },
    ];

    const tmStatuses = statuses.filter((status) => status.title.includes('TM'));
    const otherStatuses = statuses.filter((status) => !status.title.includes('TM'));

    const onClick = async ( currentGroupId, statusId ) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_HOST}/api/group-status/${currentGroupId}/statuses/${statusId}`);
            const newStatus = { status: { name: statuses.find((s) => s.id === statusId).title } };
            updateStatus(newStatus);
            setData((prevData) =>
                prevData.map((group) =>
                    group.group_id === currentGroup.group_id
                        ? {
                            ...group,
                            groupStatus: [...group.groupStatus, newStatus],
                        }
                        : group
                )
            );
        } catch (error) {
            handleApiError(error);
        }
    }

    return (
        <Container title={'Supervision des groupes'}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'calc(100% - 100px)' }}>
                <styled.StepsContainer>
                    <h3>Étapes du groupe : {currentGroup?.group_name}</h3>
                    {currentGroup && (
                        <>
                            {otherStatuses.map((status) => {
                                const findItem = currentStatus?.find(
                                    (findStatus) => findStatus.status.name === status.title
                                );
                                return (
                                    <>
                                        {findItem ? (
                                            <styled.StepCard key={status.id}>
                                                <styled.IconSuccess>
                                                    <BiCheck size={22} color={'#fff'} />
                                                </styled.IconSuccess>
                                                <styled.StepCardTitle>Étape {status.id}</styled.StepCardTitle>
                                                <styled.StepCardDescription>{status.title}</styled.StepCardDescription>
                                                <styled.StepCardTagSuccess>Terminé</styled.StepCardTagSuccess>
                                            </styled.StepCard>
                                        ) : (
                                            <styled.StepCardInWaiting key={status.id}>
                                                <styled.Icon>
                                                    <BiLoaderAlt size={22} color={'#7D8699'} />
                                                </styled.Icon>
                                                <styled.StepCardTitle>Étape {status.id}</styled.StepCardTitle>
                                                <styled.StepCardDescription>{status.title}</styled.StepCardDescription>
                                                <styled.StepCardTag>En attente</styled.StepCardTag>
                                                <Button onClick={() => onClick(currentGroup.group_id, status.id)}>Valider l'étape</Button>
                                            </styled.StepCardInWaiting>
                                        )}
                                    </>
                                );
                            })}
                            {
                                currentGroup?.group_prestation && (
                                    <>
                                        <h3>Étapes TM</h3>
                                        {tmStatuses.map((status) => {
                                            const findItem = currentStatus?.find(
                                                (findStatus) => findStatus.status.name === status.title
                                            );
                                            return (
                                                <>
                                                    {findItem ? (
                                                        <styled.StepCard key={status.id}>
                                                            <styled.IconSuccess>
                                                                <BiCheck size={22} color={'#fff'} />
                                                            </styled.IconSuccess>
                                                            <styled.StepCardTitle>Étape {status.id}</styled.StepCardTitle>
                                                            <styled.StepCardDescription>{status.title}</styled.StepCardDescription>
                                                            <styled.StepCardTagSuccess>Terminé</styled.StepCardTagSuccess>
                                                        </styled.StepCard>
                                                    ) : (
                                                        <styled.StepCardInWaiting key={status.id}>
                                                            <styled.Icon>
                                                                <BiLoaderAlt size={22} color={'#7D8699'} />
                                                            </styled.Icon>
                                                            <styled.StepCardTitle>Étape {status.id}</styled.StepCardTitle>
                                                            <styled.StepCardDescription>{status.title}</styled.StepCardDescription>
                                                            <styled.StepCardTag>En attente</styled.StepCardTag>
                                                            <Button onClick={() => onClick(currentGroup.group_id, status.id)}>Valider l'étape</Button>
                                                        </styled.StepCardInWaiting>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </>
                                )
                            }
                        </>
                    )}
                </styled.StepsContainer>
                <styled.ListGroupContainer>
                    <HeaderGroupContainer>
                        <HeaderTitle>Supervision des groupes</HeaderTitle>
                        <p>
                            Liste de tous les groupes de la journée avec leurs différents états.
                        </p>
                    </HeaderGroupContainer>
                    <styled.ListGroups>
                        <Table
                            bordered
                            pagination={{ defaultPageSize: 18 }}
                            columns={planningColumns}
                            dataSource={data?.map((obj) => ({
                                key: obj.group_id,
                                ...obj,
                            }))}
                            scroll={{ x: 1085 }}
                            style={{ marginTop: '20px' }}
                        />
                    </styled.ListGroups>
                </styled.ListGroupContainer>
            </div>
        </Container>
    );
};

export default Supervision;
