import React from 'react';
import * as styled from "./FirstStep.styled";
import {Button, DatePicker, Form} from "antd";

const FirstStep = ({ title, onFinish }) => {
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <styled.GenerateContainer>
            <styled.Header>
                <styled.GenerateTitle>{title}</styled.GenerateTitle>
            </styled.Header>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout={'vertical'}
            >
                <Form.Item
                    label="Date de la programmation"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: 'La date est requise',
                        },
                    ]}
                    style={{
                        padding: '20px' ,
                        width: '50%',
                        margin: 0,
                    }}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    style={{
                        padding: '0 20px 0 20px'
                    }}
                >
                    <Button style={{ backgroundColor: '#151d3f', color: "#fff" }} htmlType="submit">
                        Continuer
                    </Button>
                </Form.Item>
            </Form>
        </styled.GenerateContainer>
    );
};

export default FirstStep;
