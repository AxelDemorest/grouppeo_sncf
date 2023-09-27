import React, {useState} from 'react';
import * as planningStyled from '../../../PlanningCreate.styled';
import styled from 'styled-components';
import axios from "axios";
import {Button, message, Select, Table} from "antd";
import SideModal from "../../../../../../components/SideModal/SideModal";
import {useNavigate} from "react-router-dom";

const Four = ({ title, onFinish, day, numAgents }) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [agents, setAgents] = useState([]);
    const [currentGroup, setCurrentGroup] = useState({});
    const [isShowModal, setIsShowModal] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const onclick = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_HOST}/api/planning/`, { day: day, numAgents: numAgents });
            setIsGenerated(true);

            const response2 = await axios.get(`${import.meta.env.VITE_API_HOST}/api/group/day/${day}`);
            if (response2.data) {
                setData(response2.data);
            } else {
                console.error("Unexpected response structure", response2);
            }

            const response3 = await axios.get(`${import.meta.env.VITE_API_HOST}/api/planning/day/${day}`);
            if (response3.data) {
                setAgents(response3.data);
            } else {
                console.error("Unexpected response structure", response2);
            }

            const response4 = await axios.get(`${import.meta.env.VITE_API_HOST}/api/user/agents`);
            if (response4.data) {
                setUsers(response4.data);
            } else {
                console.error("Unexpected response structure", response2);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onFinished = () => {
        navigate('/liste-des-plannings', { replace: true });
    };

    const handleClose = () => {
        setIsShowModal(false);
    };

    const handleChange = async (value, option, record) => {
        await axios.post(`${import.meta.env.VITE_API_HOST}/api/planning/assign-agents`, {
            userId: value,
            agentNumber: record.agentNumber,
            day: day
        });
        messageApi.open({
            type: 'success',
            content: 'Renfort relié avec succès !',
        });
    };

    const columns = [
        {
            title: 'actions',
            align: 'center',
            key: 'actions',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            setCurrentGroup(record);
                            setIsShowModal(true);
                        }}
                    >
                        Voir tout
                    </Button>
                </div>
            ),
            width: 100,
        },
        {
            title: "Agents assigné",
            dataIndex: ['group_planning', 'agentNumber'],
            key: "agentNumber",
            align: 'center',
            width: 150,
        },
        {
            title: 'Date',
            dataIndex: ['group_train', 'train_date'],
            key: 'train_date',
            align: 'center',
            width: 100,
        },
        {
            title: 'Numéro du train',
            dataIndex: ['group_train', 'train_number'],
            key: 'train_number',
            align: 'center',
            width: 180,
        },
        {
            title: 'Nom',
            dataIndex: 'group_name',
            align: 'center',
            key: 'group_name',
            width: 300,
        },
        {
            title: 'Nombre pax',
            dataIndex: 'group_total_travellers',
            align: 'center',
            key: 'group_total_travellers',
            width: 200,
        },
        {
            title: 'Point de RDV',
            dataIndex: 'group_meeting_point',
            key: 'group_meeting_point',
            align: 'center',
            width: 450,
        },
        {
            title: 'Heure de RDV',
            dataIndex: 'group_meeting_time',
            key: 'group_meeting_time',
            align: 'center',
            width: 250,
        },
    ];

    const agentsColumns = [
        {
            title: 'Actions',
            align: 'center',
            key: 'actions',
            render: (text, record) => (
                <Select
                    showSearch
                    placeholder="Chercher un renfort"
                    optionFilterProp="children"
                    style={{ width: 200 }}
                    onChange={(value, option) => handleChange(value, option, record)}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={users.map((user) => ({
                        value: user.user_id,
                        label: `${user.user_first_name} ${user.user_last_name}`
                    }))}
                />
            ),
            width: 80,
        },
        {
            title: "Renfort",
            dataIndex: 'agentNumber',
            key: "agentNumber",
            align: 'center',
            width: 140,
        },
        {
            title: 'Date',
            dataIndex: 'planning_day',
            key: 'planning_day',
            align: 'center',
            width: 100,
        },
        {
            title: 'Heure de début',
            dataIndex: 'start_time',
            key: 'start_time',
            align: 'center',
            width: 100,
        },
        {
            title: 'Heure de fin',
            dataIndex: 'end_time',
            key: 'end_time',
            align: 'center',
            width: 100,
        },
    ];

    const labels = {
        'group_id': 'Identifiant',
        'group_name': 'Nom du groupe',
        'group_type': 'Type',
        'group_total_travellers': 'Nombre Pax',
        'group_destination': 'Destination',
        'group_car_number': 'Numéro de voiture',
        'group_meeting_time': 'Heure de RDV',
        'group_meeting_point': 'Point de RDV',
        'group_prestation': 'Traction',
        'group_responsable_departure_day': 'Responsable - jour du départ',
        'group_responsable_phone_departure_day': 'Téléphone responsable - jour du départ',
        'group_mail': 'Mail',
        'group_train': 'Informations liées au train',
        'train_id': 'Identifiant du train',
        'train_number': 'Numéro du train',
        'train_date': 'Jour de circulation',
        'train_hour': 'Heure de départ',
        'train_track': 'Voie de départ',
    };

    const unauthorizedValues = ['group_reservation_state', 'group_is_supported', 'group_planning'];

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '150%' }}>
            {contextHolder}
            <planningStyled.GenerateContainer style={{ marginRight: '50px' }}>
                <planningStyled.Header>
                    <planningStyled.GenerateTitle>{title}</planningStyled.GenerateTitle>
                </planningStyled.Header>
                <Container isGenerated={isGenerated}>
                    { isGenerated ?
                        <Table
                            columns={columns}
                            style={{ width: '100%' }}
                            dataSource={data.map((item, index) => ({
                                key: index,
                                ...item,
                            }))}
                        /> : <GenerateButton onClick={onclick}>Générer les programmations des renforts</GenerateButton>
                    }
                </Container>
            </planningStyled.GenerateContainer>
            <planningStyled.GenerateContainer width={'50%'}>
                <planningStyled.Header>
                    <planningStyled.GenerateTitle>Horaires des renforts</planningStyled.GenerateTitle>
                </planningStyled.Header>
                <Table
                    columns={agentsColumns}
                    style={{ width: '100%' }}
                    dataSource={agents.map((item, index) => ({
                        key: index,
                        ...item,
                    }))}
                />
                <div>
                    <planningStyled.CustomButton onClick={onFinished}>
                        Terminer
                    </planningStyled.CustomButton>
                </div>
            </planningStyled.GenerateContainer>
            <SideModal isShowing={isShowModal} onClose={handleClose}>
                <h2>Groupe - {currentGroup.group_name}</h2>
                <div style={{ marginTop: '30px' }}>
                    {Object.entries(currentGroup).map(([key, value]) => {
                        if (key !== 'key' && !unauthorizedValues.includes(key)) {
                            return (
                                <div key={key}>
                                    <planningStyled.Label>{labels[key] || key}:</planningStyled.Label>
                                    {
                                        typeof value === 'object' && value !== null
                                            ? Object.entries(value).map(([innerKey, innerValue]) => (
                                                <div key={innerKey}>
                                                    <planningStyled.Label>{labels[innerKey] || innerKey}:</planningStyled.Label>
                                                    <planningStyled.GroupValue>{innerValue !== null ? innerValue : 'Aucune information'}</planningStyled.GroupValue>
                                                </div>
                                            ))
                                            : <planningStyled.GroupValue>{value ? value : 'Aucune information'}</planningStyled.GroupValue>
                                    }
                                </div>
                            )
                        }
                    })}
                </div>
            </SideModal>
        </div>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.isGenerated ? '0' : '40px'};
`;

const GenerateButton = styled.button`
  font-size: 20px;
  padding: 13px 23px;
  background-color: #151d3f;
  border: none;
  margin: 0;
  cursor: pointer;
  border-radius: 6px;
  color: #fff;
`;


export default Four;
