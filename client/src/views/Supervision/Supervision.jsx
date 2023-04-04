import React, {useEffect} from 'react';
import Container from "../../components/container/Container";
import {HeaderGroupContainer, HeaderTitle} from "../../style/groupsStyles";
import * as styled from "./Supervision.styled";
import {Button, Table} from "antd";
import axios from "axios";
import { BiCheck, BiLoaderAlt } from 'react-icons/bi';
import {handleApiError} from "../../helpers/api";

const statuses = [
    { id: 1, title: 'Groupe arrivé' },
    { id: 2, title: 'Groupe pris en charge' },
    { id: 3, title: 'Groupe installé' },
    { id: 4, title: 'TM en cours' },
    { id: 5, title: 'TM terminée' },
];

function useGroupStatus(currentGroupId) {
    const [currentStatus, setCurrentStatus] = React.useState([]);

    useEffect(() => {
        async function fetchStatus() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/group-status/${currentGroupId}/status`);
                setCurrentStatus(response.data);
            } catch (error) {
                console.error(error);
                setCurrentStatus([]);
            }
        }
        fetchStatus();
    }, [currentGroupId]);

    return currentStatus;
}

const Supervision = () => {
    const [data, setData] = React.useState([]);
    const [currentGroup, setCurrentGroup] = React.useState({});
    const currentStatus = useGroupStatus(currentGroup.group_id);

    useEffect(() => {
        const date = new Date().toLocaleDateString(
            'fr-FR',
            { year: 'numeric', month: '2-digit', day: '2-digit' }
        );
        const fetchData = async () => {
            try {
                const response = await axios.get('/group/list/date', {
                    params: { date },
                    baseURL: process.env.REACT_APP_API_HOST,
                });
                setData(response.data);
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchData();
    }, []);

    const planningColumns = [
        {
            title: "Actions",
            key: "group_actions",
            width: 200,
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
            render: (text) => text ? text : 'Pas renseignée'
        },
        {
            title: "Destination",
            dataIndex: "group_destination",
            key: "group_destination",
        },
        { title: "Nom groupe", dataIndex: "group_name", key: "group_name" },
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
        { title: "Nature groupe", dataIndex: "group_type", key: "group_type" },
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

    return (
        <Container title={'Supervision des groupes'}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'calc(100% - 100px)' }}>
                <styled.StepsContainer>
                    <h3>Étapes du groupe</h3>
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
                            scroll={{ y: 1085 }}
                            style={{ marginTop: '20px' }}
                        />
                    </styled.ListGroups>
                </styled.ListGroupContainer>
            </div>
        </Container>
    );
};

export default Supervision;
