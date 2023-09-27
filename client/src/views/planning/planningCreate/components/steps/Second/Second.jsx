import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, Table, message} from "antd";
import * as styled from "../../../PlanningCreate.styled";
import axios from "axios";

const EditableRadioCell = ({ text, record, messageApi }) => {
    const [value, setValue] = useState(text);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        let updatedRecord = { ...record };
        updatedRecord.group_meeting_point = value;
        delete updatedRecord.key;

        axios.patch(`${import.meta.env.VITE_API_HOST}/api/radio/${record.id}`, updatedRecord)
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Radio modifiée avec succès',
                });
            }).catch(err => {
            console.error(err)
        });
    };

    return <Input value={value} onChange={handleChange} onBlur={handleBlur} />;
};

const Second = ({ title, onFinish }) => {
    const [data, setData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const radioColumns = [
        {
            title: 'Numéro de radios',
            dataIndex: 'number',
            key: 'radio_number',
            render: (text, record) => <EditableRadioCell text={text} record={record} messageApi={messageApi}/>,
            width: '50%',
        },
        {
            title: 'Nom',
            dataIndex: 'agentNumber',
            key: 'radio_agent_number',
            render: (text, record) => text ? `Renfort ${text}` : 'Pas assigné',
            width: '50%',
        },
    ];

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_HOST}/api/radio/type/agent`)
            .then(response => {
                setData(response.data);
            }).catch(err => {
            console.error(err)
        });
    }, []);

    const onClick = (e) => {
        onFinish()
    };

    return (
        <>
            {contextHolder}
            <styled.GenerateContainer>
                <styled.Header>
                    <styled.GenerateTitle>{title}</styled.GenerateTitle>
                </styled.Header>
                <div>
                    <styled.ShortDescription padding={'30px 30px 0 20px'}></styled.ShortDescription>
                    <Table
                        columns={radioColumns}
                        dataSource={data.map((item, index) => ({
                            key: index,
                            ...item,
                        }))}
                    />
                    <styled.CustomButton onClick={onClick}>
                        Continuer
                    </styled.CustomButton>
                </div>
            </styled.GenerateContainer>
        </>
    );
};

export default Second;
