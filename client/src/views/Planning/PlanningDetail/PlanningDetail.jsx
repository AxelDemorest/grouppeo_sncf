import React, {useEffect, useState} from 'react';
import Container from "../../../components/container/Container";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Button, Table, Select} from "antd";
import {HeaderGroupContainer, HeaderTitle} from "../../../style/groupsStyles";
import * as styled from "./PlanningDetail.styled";

const PlanningDetail = () => {
    const [groups, setGroups] = useState([]);
    const [planningUser, setPlanningUser] = useState([]);
    const [planningGMP, setPlanningGMP] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [userId, setUserId] = useState();
    const [groupMeetingPoint, setGroupMeetingPoint] = useState("1");
    let { planningDate } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groups, planning, planningGMP, listUsers] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_HOST}/group/day/${planningDate}`),
                    axios.get(`${process.env.REACT_APP_API_HOST}/planning/day/${planningDate}/user/${userId}`),
                    axios.get(`${process.env.REACT_APP_API_HOST}/group/day/${planningDate}/group-meeting-point/${groupMeetingPoint}`),
                    axios.get(`${process.env.REACT_APP_API_HOST}/user/planning/${planningDate}/users`)
                ]);

                setGroups(groups.data);
                setPlanningUser(planning.data.planning_groups);
                setPlanningGMP(planningGMP.data);
                setListUsers(listUsers.data);
                console.log(planning.data.planning_groups)
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [groupMeetingPoint, planningDate, userId]);

    const handleChange = (value) => {
        setUserId(value);
    };

    const handleChangeGroupMeetingPoint = (value) => {
        setGroupMeetingPoint(value);
    };

    const tableColumn = [
        {
            title: "Actions",
            key: "group_actions",
            width: 200,
        },
        {
            title: "Agent assigné (CP)",
            dataIndex: ['group_planning', 'planning_user', 'user_cp'],
            key: "user_cp",
            width: 250,
        },
        {
            title: "Agent assigné (Mail)",
            dataIndex: ['group_planning', 'planning_user', 'user_mail'],
            key: "user_mail",
            width: 250,
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

    const planningColumns = [
        {
            title: "Actions",
            key: "group_actions",
            width: 200,
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

    return (
        <Container title={`Détail du planning du ${planningDate}`}>
            <styled.Details>
                <h2>Planning complet</h2>
                <Table
                    bordered
                    scroll={{ x: 1000 }}
                    pagination={{ defaultPageSize: 18 }}
                    columns={tableColumn}
                    dataSource={groups.map((obj) => ({
                        key: obj.group_id,
                        ...obj,
                    }))}
                    style={{ marginTop: '20px' }}
                />
            </styled.Details>
            <styled.Details>
                <h2>Planning filtré par renfort</h2>
                <Select
                    style={{ width: 200, marginTop: '10px' }}
                    onChange={handleChange}
                    options={listUsers.map((item) => (
                        {
                            value: item.user_id,
                            label: `${item.user_first_name} ${item.user_last_name}`
                        }
                    ))}
                />
                <Table
                    bordered
                    scroll={{ x: 1000 }}
                    pagination={{ defaultPageSize: 18 }}
                    columns={planningColumns}
                    dataSource={planningUser?.map((obj) => ({
                        key: obj.group_id,
                        ...obj,
                    }))}
                    style={{ marginTop: '20px' }}
                />
            </styled.Details>
            <styled.Details>
                <h2>Planning filtré par point de rendez-vous</h2>
                <Select
                    defaultValue='1'
                    style={{ width: 200, marginTop: '10px' }}
                    onChange={handleChangeGroupMeetingPoint}
                    options={[
                        { value: '1', label: 'Point de RDV 1' },
                        { value: '2', label: 'Point de RDV 2' },
                        { value: '3', label: 'Point de RDV 3' },
                        { value: '4', label: 'Point de RDV 4' },
                        { value: '5', label: 'Point de RDV 5' },
                    ]}
                />
                <Table
                    bordered
                    scroll={{ x: 1000 }}
                    pagination={{ defaultPageSize: 18 }}
                    columns={planningColumns}
                    dataSource={planningGMP?.map((obj) => ({
                        key: obj.group_id,
                        ...obj,
                    }))}
                    style={{ marginTop: '20px' }}
                />
            </styled.Details>
        </Container>
    );
};

export default PlanningDetail;
