import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../components/container/Container";
import { Button, Table, message, Popconfirm } from "antd";
import styled from "styled-components";

import { HeaderGroupContainer, HeaderTitle } from "../../style/groupsStyles.js";
import UserModal from "../../components/userModal/UserModal";
import UserEditModal from "../../components/userEditModal/UserEditModal";

const UserAdmin = () => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [data, setData] = useState([]);
    const [record, setRecord] = useState({});
    const [open, setOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleDelete = async (item) => {
        await axios.delete(`http://localhost:3001/user/${item.user_id}`);
        setData((current) =>
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

    const onEdit = async (values, formEdit) => {
        await axios.patch(`http://localhost:3001/user/${values.user_id}`, values);
        setConfirmLoading(true);
        const newState = data.map((obj) => {
            if (obj.user_id === values.user_id) {
                return { ...values };
            }

            return obj;
        });
        setData(newState);
        setTimeout(() => {
            setEditModalOpen(false);
            setConfirmLoading(false);
            message.success("L'utilisateur a bien été modifié");
        }, 2000);
    };

    useEffect(() => {
        const getUsers = async () => {
            const { data } = await axios.get("http://localhost:3001/user/user");
            setData(data);
        };

        getUsers();
    }, []);

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
                    <Button
                        style={{ marginRight: "20px" }}
                        onClick={() => {
                            setEditModalOpen(true);
                            setRecord(record);
                        }}
                    >
                        Éditer
                    </Button>
                    <Popconfirm
                        placement="topRight"
                        title={"Êtes vous sûr de vouloir supprimer cet utilisateur ?"}
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button>Supprimer</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Container>
            <div>
                <HeaderGroupContainer>
                    <HeaderTitle>Gestion des utilisateurs</HeaderTitle>
                    <p>
                        Liste de tous les utilisateurs ayant des droits sur l'application.
                    </p>
                    <Button
                        style={{ marginBottom: "10px" }}
                        onClick={() => {
                            setOpen((c) => !c);
                        }}
                    >
                        Ajouter un utilisateur
                    </Button>
                </HeaderGroupContainer>
                <CustomTable>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={data.map((obj) => ({
                            key: obj.user_id,
                            ...obj,
                        }))}
                    />
                </CustomTable>
            </div>
            <UserModal
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen((c) => !c);
                }}
                confirmLoading={confirmLoading}
            />
            <UserEditModal
                open={editModalOpen}
                onCreate={onEdit}
                onCancel={() => {
                    setEditModalOpen(false);
                    setRecord({});
                }}
                confirmLoading={confirmLoading}
                record={record}
            />
        </Container>
    );
};

const CustomTable = styled.div`
  width: 90%;
  margin: 25px 40px 40px 40px;
  padding: 30px 30px 15px 30px;
  height: 70vh;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
`;

export default UserAdmin;
