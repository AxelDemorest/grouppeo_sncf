import React, {useEffect, useState} from 'react';
import Container from "../../../components/container/Container";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Button, Table, Select, Popover, Alert, message, Form, Input, Modal} from "antd";
import * as styled from "./PlanningDetail.styled";
import { saveAs } from 'file-saver';
import {fetchUserDetails} from "../../../api/services/userServices";
import {fetchIsolatedGroups, fetchPointGroups, fetchUserGroups} from "../../../api/services/groupServices";
import GroupForm from "./components/groupForm";
import TrainModal from "./components/trainModal";

const content = (
    <div>
        <p>Permet d'isoler le groupe hors du planning,</p>
        <p>il ne sera plus assigné à un agent</p>
    </div>
);

const PlanningDetail = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [isGroupProcessing, setIsGroupProcessing] = useState(false);
    const [currentGroup, setCurrentGroup] = useState({});

    const [train, setTrain] = useState({});

    const [agents, setAgents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [planningUser, setPlanningUser] = useState([]);
    const [planningGMP, setPlanningGMP] = useState([]);
    const [listUsers, setListUsers] = useState(0);
    const [userId, setUserId] = useState();
    const [isFormVisible, setFormVisible] = useState(false);
    const [planningType, setPlanningType] = useState('all');
    const [groupMeetingPoint, setGroupMeetingPoint] = useState("1");
    const [currentPlanningId, setCurrentPlanningId] = useState(0);
    const [isolatedGroups, setIsolatedGroups] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let { planningDate } = useParams();

    const fetchData = async () => {
        try {
            const [
                groups,
                listUsers,
                responseAgents
            ] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_HOST}/api/group/day/${planningDate}`),
                axios.get(`${import.meta.env.VITE_API_HOST}/api/planning/day/${planningDate}/agents/count`),
                axios.get(`${import.meta.env.VITE_API_HOST}/api/user/agents`),
            ]);

            const isolatedGroups = await fetchIsolatedGroups(planningDate);
            setIsolatedGroups(isolatedGroups);
            setGroups(groups.data);
            setListUsers(listUsers.data);
            setAgents(responseAgents.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUserSpecificData = async () => {
        try {
            if (userId) {
                const userDetails = await fetchUserDetails(planningDate, userId);
                setCurrentPlanningId(userDetails);

                const userGroups = await fetchUserGroups(planningDate, userId);
                setPlanningUser(userGroups);
            } else if (groupMeetingPoint) {
                const pointGroups = await fetchPointGroups(planningDate, groupMeetingPoint);
                setPlanningGMP(pointGroups);
            } else {
                const isolatedGroups = await fetchIsolatedGroups(planningDate);
                setIsolatedGroups(isolatedGroups);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchUserSpecificData();
    }, [planningDate, userId, groupMeetingPoint]);

    const planningColumns = [
        {
            title: "Actions",
            key: "group_actions",
            render: (text, record) => (
                <Button onClick={() => {
                    setIsGroupProcessing(true)
                    setCurrentGroup(record)
                }}>
                    Assigner à un autre renfort
                </Button>
            ),
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

    const tableColumn = [
        {
            title: "Actions",
            key: "group_actions",
            width: 200,
            align: 'center',
            render: (text, record) => (
                <Popover content={content}>
                    <Button onClick={(value) => onIsolate(value, record)}>
                        Isoler le groupe
                    </Button>
                </Popover>
            )
        },
        {
            title: "Agents assigné",
            dataIndex: ['group_planning', 'agentNumber'],
            key: "agentNumber",
            render: (text) => (
                <styled.AgentButton>
                    Renfort {text}
                </styled.AgentButton>
            ),
            align: 'center',
            width: 180,
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
            width: 140,
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

    const handleChange = (value) => {
        setUserId(value);
        setIsGroupProcessing(false);
    };

    const handleChangeGroupMeetingPoint = (value) => {
        setGroupMeetingPoint(value);
    };

    const onTypeChange = (value) => {
        setPlanningType(value);
        setGroupMeetingPoint(null);
        setUserId(null);
    };

    const onDownload = async (value) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/api/excel/export/planning/${currentPlanningId.planning_id}`, { tableData: planningUser }, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            saveAs(blob, 'myfile.xlsx');
        } catch (error) {
            console.error(error);
        }
    }

    const onDownloadMeetingPoint = async (value) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_HOST}/api/excel/export/meeting-point/${groupMeetingPoint}/day/${planningDate}`, { tableData: planningGMP }, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            saveAs(blob, 'planning_point_groupe.xlsx');
        } catch (error) {
            console.error(error);
        }
    }

    const onIsolate = async (value, record) => {
        try {
            axios.delete(`${import.meta.env.VITE_API_HOST}/api/group/${record.group_id}/planning`)
                .then(async () => {
                    const updatedGroups = groups.filter(group => group.group_id !== record.group_id);
                    const assignIsolatedGroups = await fetchIsolatedGroups(planningDate);
                    setIsolatedGroups(assignIsolatedGroups);
                    setGroups(updatedGroups);
                    messageApi.open({
                        type: 'success',
                        content: 'Groupe isolé avec succès',
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const onAssign = async (value, option, userId) => {
        const planning = await axios.post(`${import.meta.env.VITE_API_HOST}/api/planning/assign-agents`, {
            userId: value,
            agentNumber: userId,
            day: planningDate
        });
        setCurrentPlanningId(planning.data);
        messageApi.open({
            type: 'success',
            content: 'Renfort relié avec succès !',
        });
    };

    const handleAssignGroup = async (value) => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_HOST}/api/planning/day/${planningDate}/agent-number/${value}`);
        await axios.post(`${import.meta.env.VITE_API_HOST}/api/group/${currentGroup.group_id}/assign-planning/${data.planning_id}`);
        const updatedPlanningUser = planningUser.filter((group) => group.group_id !== currentGroup.group_id);
        setIsolatedGroups(isolatedGroups.filter((group) => group.group_id !== currentGroup.group_id));
        setPlanningUser(updatedPlanningUser);
        setIsGroupProcessing(false);
        messageApi.open({
            type: 'success',
            content: 'Groupe assigné avec succès !',
        });
    }

    return (
        <>
            {contextHolder}
            <Container title={`Détail du planning du ${planningDate}`}>
                {isGroupProcessing && (
                    <styled.Details style={{ marginBottom: '0', width: '50%', padding: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <p style={{ margin: '0 20px 0 0' }}>À qui souhaitez vous assigner le groupe ?</p>
                            <Select
                                style={{ width: 200 }}
                                onChange={handleAssignGroup}
                                options={Array.from({ length: listUsers }, (_, i) => ({ label: `Renfort ${i + 1}`, value: i + 1 }))}
                            />
                        </div>
                    </styled.Details>
                )}
                { isolatedGroups.length > 0 && <Alert message={`Des groupes isolés ont été détectés`} style={{ margin: '25px 40px 0 40px' }} type="info" showIcon /> }
                { isFormVisible && <GroupForm
                    train={train}
                    date={planningDate}
                    setIsFormVisible={setFormVisible}
                    setIsolatedGroups={setIsolatedGroups}
                    messageApi={messageApi}
                    setData={setGroups}
                /> }
                <styled.Row>
                    <styled.Details style={planningType !== 'agent' ? { width: '100%' } : {}}>
                        <div style={{ marginBottom: '20px', float: 'right' }}>
                            <Button size={'large'} style={{ marginRight: '20px' }} onClick={() => {
                                setIsModalOpen(true)
                                setTrain({})
                                setFormVisible(false)
                            }}>
                                Créer un groupe
                            </Button>
                            <Select
                                size={'large'}
                                onChange={onTypeChange}
                                defaultValue="all"
                                style={{ width: 250 }}
                                options={[
                                    { value: 'all', label: 'Planning complet' },
                                    { value: 'agent', label: 'Planning par renfort' },
                                    { value: 'point', label: 'Planning par point' },
                                    { value: 'isolate', label: 'Planning par groupes isolés' },
                                ]}
                            />
                        </div>
                    {planningType === 'all' && (
                        <>
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
                        </>
                    )}

                    {planningType === 'agent' && (
                        <>
                            <h2>Planning filtré par renfort</h2>
                            { !currentPlanningId.planning_user && <Alert message="Aucun renfort n'a été assigné" type="warning" showIcon style={{ width: '30%' }} />}
                            <Select
                                style={{ width: 200, marginTop: '10px', marginRight: '20px' }}
                                onChange={handleChange}
                                options={Array.from({ length: listUsers }, (_, i) => ({ label: `Renfort ${i + 1}`, value: i + 1 }))}
                            />
                            {
                                !currentPlanningId.planning_user && <Select
                                    showSearch
                                    placeholder="Assigner un renfort"
                                    optionFilterProp="children"
                                    style={{ width: 200, marginRight: '20px' }}
                                    onChange={(value, option) => onAssign(value, option, userId)}
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={agents.map((user) => ({
                                        value: user.user_id,
                                        label: `${user.user_first_name} ${user.user_last_name}`
                                    }))}
                                />
                            }
                            <Button onClick={onDownload}>
                                Télécharger le planning
                            </Button>
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
                        </>
                    )}

                    {planningType === 'point' && (
                        <>
                            <h2>Planning filtré par point de rendez-vous</h2>
                            <Select
                                defaultValue='1'
                                style={{ width: 200, marginTop: '10px', marginRight: '20px' }}
                                onChange={handleChangeGroupMeetingPoint}
                                options={[
                                    { value: '1', label: 'Point de RDV 1' },
                                    { value: '2', label: 'Point de RDV 2' },
                                    { value: '4', label: 'Point de RDV 4' },
                                    { value: '5', label: 'Point de RDV 5' },
                                ]}
                            />
                            <Button onClick={onDownloadMeetingPoint}>
                                Télécharger le planning
                            </Button>
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
                        </>
                    )}

                    {planningType === 'isolate' && (
                        <>
                            <h2>Planning filtré par groupes isolés</h2>
                            <Table
                                bordered
                                scroll={{ x: 1000 }}
                                pagination={{ defaultPageSize: 18 }}
                                columns={planningColumns}
                                dataSource={isolatedGroups?.map((obj) => ({
                                    key: obj.group_id,
                                    ...obj,
                                }))}
                                style={{ marginTop: '20px' }}
                            />
                        </>
                    )}
                </styled.Details>
                    {planningType === 'agent' && (
                        <styled.UserDetails>
                            <h2>Informations du renfort</h2>
                            <styled.Information>
                                <p>Prénom</p>
                                <span>-</span>
                                <p>
                                    {currentPlanningId?.planning_user?.user_first_name}
                                </p>
                            </styled.Information>
                            <styled.Information>
                                <p>Nom</p>
                                <span>-</span>
                                <p>
                                    {currentPlanningId?.planning_user?.user_last_name}
                                </p>
                            </styled.Information>
                            <styled.Information>
                                <p>Horaires</p>
                                <span>-</span>
                                <p>
                                    {currentPlanningId?.start_time} - {currentPlanningId?.end_time}
                                </p>
                            </styled.Information>
                            <styled.Information>
                                <p>Total</p>
                                <span>-</span>
                                <p>
                                    {planningUser?.length} groupes
                                </p>
                            </styled.Information>
                        </styled.UserDetails>
                    )}
                </styled.Row>
            </Container>
            <TrainModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                messageApi={messageApi}
                day={planningDate}
                setTrain={setTrain}
                setFormVisible={setFormVisible}
            />
        </>
    );
};

export default PlanningDetail;
