import { Button, message, Popconfirm, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AgentDayModal from '../../components/modal/agentDayModal/AgentDayModal';
import Container from '../../components/container/Container';
import UserModal from '../../components/modal/userModal/UserModal';
import { HeaderGroupContainer, HeaderTitle } from '../../style/groupsStyles';
import GenerateProg from "../../components/modal/generateProg/GenerateProg";

const AgentAdmin = () => {
    const [data, setData] = useState([]);
    const [todayAgents, setTodayAgents] = useState([]);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [record, setRecord] = useState({});

    const [openAgentModal, setOpenAgentModal] = useState(false);
    const [openGenerateProgModal, setOpenGenerateProgModal] = useState(false);

    const [generatedPlanning, setGeneratedPlanning] = useState([]);

    useEffect(() => {
        const getAgents = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_HOST}/user/agents`);
            setData(data);
        };

        const getAllAgentsOfToday = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_HOST}/user/today/agents`);
            setTodayAgents(data);
        };

        getAgents();
        getAllAgentsOfToday();
    }, []);

    const handleDelete = async (item) => {
        await axios.delete(`${process.env.REACT_APP_API_HOST}/user/${item.user_id}`);
        setData((current) =>
            current.filter((currentItem) => currentItem.user_id !== item.user_id)
        );
        setTodayAgents((current) =>
            current.filter((currentItem) => currentItem.user_id !== item.user_id)
        );
    };

    const onCreate = async (values, form) => {
        const { data } = await axios.post(
            `${process.env.REACT_APP_API_HOST}/user/user`,
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
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API_HOST}/user/${date}/${user_id}`,
            );

            setConfirmLoading(true);
            setTimeout(() => {
                setOpenAgentModal(false);
                setConfirmLoading(false);
                if (date === new Date().toLocaleDateString(
                    'fr-FR',
                    { year: 'numeric', month: '2-digit', day: '2-digit' }
                )) {
                    setTodayAgents((current) => [
                        ...current,
                        { key: user_id, ...data.post },
                    ]);
                }
                message.success("L'utilisateur a bien été assignée à la journée souhaitée");
            }, 2000);
        } catch (error) {
            setOpenAgentModal(false);
            console.error(error);
            message.error('Cet agent est déjà assigné à cette journée.');
        }
    };

    const onGenerate = async (date) => {
        setConfirmLoading(true);
        const { data } = await axios.post(
            `${process.env.REACT_APP_API_HOST}/planning/`,
            { day: date }
        );
        setGeneratedPlanning(data.post)
        setTimeout(() => {
            setConfirmLoading(false);
            setOpenGenerateProgModal(false);
            message.success("La programmation a bien été générée à la journée souhaitée");
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
        <Container title={'Gestion des agents'}>
            <div style={{ margin: '25px 40px 0 40px' }}>
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
                        setOpenGenerateProgModal((c) => !c);
                    }}
                >
                    Générer une programmation automatique
                </Button>
            </div>
            <GlobalContainer>
                <SubContainer>
                    <h2>Liste totale des agents</h2>
                    <Table
                        scroll={{ y: 800 }}
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
                        scroll={{ y: 800 }}
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
            <GenerateProg
                open={openGenerateProgModal}
                onCreate={onGenerate}
                onCancel={() => {
                    setOpenGenerateProgModal((c) => !c);
                    setRecord({});
                }}
                confirmLoading={confirmLoading}
                generatedPlanning={generatedPlanning}
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
  margin: 0 90px 40px 0px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  border: 1.5px solid #eaeaea;
  background-color: #fff;
  @media (max-width: 2000px) {
    width: 100%;
    margin: 0px 90px 15px 0px;
  }
`;

export default AgentAdmin;
