import { Button, DatePicker, message, Popconfirm, Table } from 'antd';
import _default from 'antd/lib/grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AgentDayModal from '../../components/modal/agentDayModal/AgentDayModal';
import Container from '../../components/container/Container';
import UserModal from '../../components/modal/userModal/UserModal';
import { HeaderGroupContainer, HeaderTitle } from '../../style/groupsStyles';

const AgentAdmin = () => {
    const [data, setData] = useState([]);
    const [todayAgents, setTodayAgents] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState({});
    const [openAgentModal, setOpenAgentModal] = useState(false);

    useEffect(() => {
        const getAgents = async () => {
            const { data } = await axios.get("http://localhost:3001/user/agents");
            setData(data);
        };

        const getAllAgentsOfToday = async () => {
            const { data } = await axios.get("http://localhost:3001/user/today/agents");
            setTodayAgents(data);
        };

        getAgents();
        getAllAgentsOfToday();
    }, []);

    const handleDelete = async (item) => {
        await axios.delete(`http://localhost:3001/user/${item.user_id}`);
        setData((current) =>
            current.filter((currentItem) => currentItem.user_id !== item.user_id)
        );
        setTodayAgents((current) =>
            current.filter((currentItem) => currentItem.user_id !== item.user_id)
        );
    };

    const onCreate = async (values, form) => {
        const { data } = await axios.post(
            "http://localhost:3001/user/user",
            values
        );
        setConfirmLoading(true);
        setTimeout(() => {
            form.resetFields();
            setOpen(false);
            setConfirmLoading(false);
            setData((current) => [
                ...current,
                { key: data.post.user_id, ...data.post },
            ]);
            message.success("L'utilisateur a bien été crée");
        }, 2000);
    };

    const onAssign = async (date, user_id) => {

        const { data } = await axios.post(
            `http://localhost:3001/user/${date}/${user_id}`,
        );

        setConfirmLoading(true);
        setTimeout(() => {
            setOpenAgentModal(false);
            setConfirmLoading(false);
            if (date === new Date().toDateString()) {
                setTodayAgents((current) => [
                    ...current,
                    { key: data.post.user_id, ...data.post },
                ]);
            }
            message.success("L'utilisateur a bien été assignée à la journée souhaitée");
        }, 2000);
    };

    const columns = [
        {
            title: "CP",
            dataIndex: "user_cp",
            key: "user_cp",
        },
        {
            title: "Email",
            dataIndex: "user_mail",
            key: "user_mail",
        },
        {
            title: "Rôle",
            dataIndex: "user_type",
            key: "user_type",
        },
        {
            title: "Actions",
            key: "user_actions",
            render: (_, record) => (
                <>
                    <Popconfirm
                        placement="topRight"
                        title={"Êtes vous sûr de vouloir supprimer cet agent ?"}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button
                            style={{ marginRight: "20px" }}
                        >Supprimer</Button>
                    </Popconfirm>
                    <Button
                        type='primary'
                        style={{ marginTop: "15px" }}
                        onClick={() => {
                            setOpenAgentModal(true);
                            setRecord(record.user_id)
                        }}
                    >
                        Assigner à une journée
                    </Button>
                </>
            ),
        },
    ];

    const columnsToday = [
        {
            title: "CP",
            dataIndex: "user_cp",
            key: "user_cp",
        },
        {
            title: "Email",
            dataIndex: "user_mail",
            key: "user_mail",
        },
        {
            title: "Rôle",
            dataIndex: "user_type",
            key: "user_type",
        },
        {
            title: "Actions",
            key: "user_actions",
            render: (_, record) => (
                <>
                    <Popconfirm
                        placement="topRight"
                        title={"Êtes vous sûr de vouloir supprimer cet agent de la journée ?"}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button
                            danger
                            style={{ marginRight: "20px" }}
                        >Supprimer de la journée</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Container>
            <HeaderGroupContainer>
                <HeaderTitle>Gestion des agents</HeaderTitle>
                <p>
                    Gérez les agents en les assignant à des journées.
                </p>
                <div>
                    <Button
                        style={{ marginBottom: "10px", marginRight: "20px" }}
                        onClick={() => {
                            setOpen((c) => !c);
                        }}
                    >
                        Ajouter un agent
                    </Button>
                    <Button
                        style={{ marginBottom: "10px" }}
                        onClick={() => {
                            setOpen((c) => !c);
                        }}
                    >
                        Générer une programmation automatique
                    </Button>
                </div>
            </HeaderGroupContainer>
            <GlobalContainer>
                <SubContainer>
                    <h2>Liste totale des agents</h2>
                    <Table
                        scroll={{ y: 300 }}
                        bordered
                        columns={columns}
                        dataSource={data.map((obj) => ({
                            key: obj.user_id,
                            ...obj,
                        }))}
                        style={{ marginTop: '20px' }}
                    />
                </SubContainer>
                <SubContainer>
                    <h2>Agents sur le terrain aujourd'hui</h2>
                    <Table
                        bordered
                        columns={columnsToday}
                        dataSource={todayAgents.map((obj) => ({
                            key: obj.user_id,
                            ...obj,
                        }))}
                        style={{ marginTop: '20px' }}
                    />
                </SubContainer>
            </GlobalContainer>
            <UserModal
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen((c) => !c);
                }}
                confirmLoading={confirmLoading}
                agentInput={false}
            />
            <AgentDayModal
                open={openAgentModal}
                onCreate={onAssign}
                onCancel={() => {
                    setOpenAgentModal((c) => !c);
                    setRecord({});
                }}
                confirmLoading={confirmLoading}
                userId={record}
            />
        </Container>
    );
};

const GlobalContainer = styled.div`
  width: 90%;
  margin: 25px 40px 40px 40px;
  display: flex;
  flex-direction: row;
  @media (max-width: 2000px) {
    flex-direction: column;
  }
`;

const SubContainer = styled.div`
  width: 40%;
  height: 100%;
  margin: 0px 90px 40px 0px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  @media (max-width: 2000px) {
    width: 100%;
    margin: 0px 90px 15px 0px;
  }
`;

export default AgentAdmin;