import React from 'react';
import {Form, Input, InputNumber, Select} from "antd";
import {createRadio} from "../../../api/services/radioServices";
import {handleApiError} from "../../../api/errors/apiErrorHandler";

const RadioForm = ({ form, setRadios }) => {
    const onFinish = async (values) => {
        const data = {
            ...values,
            type: 'agent',
        }

        try {
            const response = await createRadio(data);
            setRadios((current) => [...current, response.post]);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Form form={form} onFinish={onFinish} style={{ marginTop: '20px' }}>
            <Form.Item name="number" label="Numéro de la radio" rules={[{ required: true, message: 'Veuillez saisir le numéro de la radio!' }]}>
                <Input placeholder="Saisir le numéro de la radio" />
            </Form.Item>
            <Form.Item name="agentNumber" label="Assigner à" rules={[{ required: true, message: 'Veuillez choisir une assignation!' }]}>
                <InputNumber min={1} />
            </Form.Item>
        </Form>
    );
};

export default RadioForm;
