import React, { useEffect, useRef } from "react";
import { Form, Input, Modal, Select } from "antd";
import styled from "styled-components";

const UserEditModal = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
    record
}) => {
    const [formEdit] = Form.useForm();

    useEffect(() => {
        setTimeout(() => {
            formEdit.resetFields();
        });
    }, [record, formEdit]);

    const handleOk = () => {
        formEdit
            .validateFields()
            .then((values) => {
                onCreate(values, formEdit);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <>
            <Modal
                style={{ top: '150px' }}
                bodyStyle={{ height: 320 }}
                width={1000}
                title="Éditer un utilisateur"
                open={open}
                onOk={handleOk}
                onCancel={() => {
                    formEdit.resetFields();
                    onCancel();
                }}
                okText="Mettre à jour"
                cancelText="Retour"
                confirmLoading={confirmLoading}
            >
                <FormModal
                    form={formEdit}
                    layout="vertical"
                    name="edit_group_form"
                    initialValues={record}
                >
                    <FormItem hidden={true} name="user_id">
                        <Input />
                    </FormItem>
                    <FormItem name="user_cp" label="CP">
                        <Input />
                    </FormItem>
                    <FormItem name="user_mail" label="Email">
                        <Input />
                    </FormItem>
                    <FormItem name="user_first_name" label="Prénom">
                        <Input />
                    </FormItem>
                    <FormItem name="user_last_name" label="Nom de famille">
                        <Input />
                    </FormItem>
                    <FormItem name="user_type" label="Rôle">
                        <Select>
                            <Select.Option value="Administrateur">Administrateur</Select.Option>
                            <Select.Option value="UO service">UO Service</Select.Option>
                            <Select.Option value="Agent">Agent</Select.Option>
                            <Select.Option value="Utilisateur">Utilisateur</Select.Option>
                        </Select>
                    </FormItem>
                </FormModal>
                <p>Lors de la validation du formulaire, un mail sera envoyé à l'adresse indiquée dans le champs "Email" pour récupérer le mot de passe généré.</p>
            </Modal>
        </>
    );
};

const FormModal = styled(Form)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const FormItem = styled(Form.Item)`
  margin-right: 20px !important;
  width: 45%;
`;


export default UserEditModal;