import { Button, message, Popconfirm, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import AgentDayModal from '../../../components/modal/agentDayModal/AgentDayModal';
import Container from '../../../components/container/Container';
import UserModal from '../../../components/modal/userModal/UserModal';
import { HeaderGroupContainer, HeaderTitle } from '../../../style/groupsStyles';
import GenerateProg from "../../../components/modal/generateProg/GenerateProg";
import {useNavigate} from "react-router-dom";

const Agents = () => {
    const navigate = useNavigate();
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
            const { data } = await axios.get(`${import.meta.env.VITE_API_HOST}/api/user/agents`);
            setData(data);
        };

        const getAllAgentsOfToday = async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API_HOST}/api/user/today/agents`);
            setTodayAgents(data);
        };

        getAgents();
        getAllAgentsOfToday();
    }, []);

    const handleDelete = async (item) => {
        await axios.delete(`${import.meta.env.VITE_API_HOST}/api/user/${item.user_id}`);
        setData((current) =>
            current.filter((currentItem) => currentItem.user_id !== item.user_id)
        );
        setTodayAgents((current) =>
            current.filter((currentItem) => currentItem.user_id !== item.user_id)
        );
    };

    const onCreate = async (values, form) => {
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_HOST}/api/user/user`,
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
                `${import.meta.env.VITE_API_HOST}/api/user/${date}/${user_id}`,
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
            message.error('Cet agents est déjà assigné à cette journée.');
        }
    };

    const onGenerate = async (date) => {
        setConfirmLoading(true);
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_HOST}/api/planning/`,
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
                        title={"Êtes vous sûr de vouloir supprimer cet agents ?"}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button
                            style={{ marginRight: "20px" }}
                        >Supprimer</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Container title={'Gestion des renforts'}>
            <CustomTable>
                <Button
                    style={{ margin: "0 20px 20px 20px" }}
                    onClick={() => {
                        setOpen((c) => !c);
                    }}
                >
                    Ajouter un renfort
                </Button>
                <Button
                    style={{ marginBottom: "10px" }}
                    onClick={() => {
                        navigate('/creation-planning', { replace: true });
                    }}
                >
                    Générer une programmation automatique
                </Button>
                <Table
                    scroll={{ y: 800 }}
                    columns={columns}
                    style={{ borderTop: '1px solid #ececec', borderRadius: '0px' }}
                    dataSource={data.map((obj) => ({
                        key: obj.user_id,
                        ...obj,
                    }))}
                />
            </CustomTable>
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

const CustomTable = styled.div`
  height: auto;
  width: auto;
  margin: 25px 40px 40px 40px;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
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

export default Agents;
