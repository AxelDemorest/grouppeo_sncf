import React, { useEffect, useRef } from "react";
import { Form, Input, Modal, Select } from "antd";
import styled from "styled-components";

const useResetFormOnCloseModal = ({ form, open }) => {
    const prevOpenRef = useRef();
    useEffect(() => {
        prevOpenRef.current = open;
    }, [open]);
    const prevOpen = prevOpenRef.current;
    useEffect(() => {
        if (!open && prevOpen) {
            form.resetFields();
        }
    }, [form, prevOpen, open]);
};

const UserModal = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
    agentInput = true
}) => {
    const [form] = Form.useForm();

    useResetFormOnCloseModal({
        form,
        open,
    });

    useEffect(() => form.resetFields(), [form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onCreate(values, form);
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
                title="Ajouter un utilisateur"
                open={open}
                onOk={handleOk}
                onCancel={() => {
                    form.resetFields();
                    onCancel();
                }}
                okText="Créer"
                cancelText="Retour"
                confirmLoading={confirmLoading}
            >
                <FormModal
                    form={form}
                    layout="vertical"
                    name="edit_group_form"
                    initialValues={ !agentInput ? { user_type: "Agent" } : {}}
                >
                    <FormItem name="user_cp" label="CP">
                        <Input />
                    </FormItem>
                    <FormItem name="user_mail" label="Email">
                        <Input />
                    </FormItem>
                    <FormItem name="user_first_name" label="Prénom">
                        <Input/>
                    </FormItem>
                    <FormItem name="user_last_name" label="Nom de famille">
                        <Input />
                    </FormItem>
                    <FormItem name="user_type" label="Rôle">
                        <Select disabled={!agentInput}>
                            <Select.Option value="Administrateur">Administrateur</Select.Option>
                            <Select.Option value="UO service">UO Service</Select.Option>
                            <Select.Option value="Agent">Agent</Select.Option>
                            <Select.Option value="Utilisateur">Utilisateur</Select.Option>
                            <Select.Option value="DPX">DPX</Select.Option>
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

export default UserModal;