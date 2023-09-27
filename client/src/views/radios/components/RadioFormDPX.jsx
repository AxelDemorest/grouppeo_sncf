import React from 'react';
import {Form, Input, InputNumber, Select} from "antd";
import {createRadio} from "../../../api/services/radioServices";
import {handleApiError} from "../../../api/errors/apiErrorHandler";

const RadioFormDPX = ({ form, setRadios }) => {
    const onFinish = async (values) => {
        const data = {
            ...values,
            type: 'dpx',
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
            <Form.Item name="dpx" label="Assigner à" rules={[{ required: true, message: 'Veuillez saisir le nom du DPX!' }]}>
                <Input placeholder="Saisir le nom du DPX" />
            </Form.Item>
        </Form>
    );
};

export default RadioFormDPX;
