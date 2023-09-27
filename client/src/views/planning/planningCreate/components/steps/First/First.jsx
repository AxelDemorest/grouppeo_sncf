import React, {useState} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, Tag} from "antd";
import * as styled from "../../../PlanningCreate.styled";

const { TextArea } = Input;

const First = ({ title, onFinish }) => {
    const [values, setValues] = useState({
        date: '',
        comments: '',
        numAgents: 0
    });
    const onChange = (date, dateString) => {
        const formatDate = new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
        setValues({ ...values, date: formatDate });
    };

    const onCommentChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = () => {
      onFinish(values);
    };

    const onNumberChange = (value) => {
        setValues({ ...values, numAgents: value });
    };

    return (
        <styled.GenerateContainer>
            <styled.Header>
                <styled.GenerateTitle>{title}</styled.GenerateTitle>
            </styled.Header>
            <styled.Form
                name="dateForm"
                onSubmit={onSubmit}
            >
                <div style={{ marginBottom: '35px' }}>
                    <styled.ShortDescription>Veuillez définir la journée de génération de programmation que vous souhaitez.</styled.ShortDescription>
                    <DatePicker
                        defaultValue={values.date}
                        onChange={onChange}
                        style={{ width: '30%', marginRight: '20px' }}
                    />
                </div>
                <div style={{ marginBottom: '35px' }}>
                    <styled.ShortDescription>Souhaitez-vous imposer un nombre de renfort ? Indiquez le uniquement si vous avez besoin.</styled.ShortDescription>
                    <InputNumber min={1} onChange={onNumberChange} />
                </div>
                <div style={{ marginBottom: '35px' }}>
                    <styled.ShortDescription>Indiquez des commentaires qui seront affichés directement sur les programmations.</styled.ShortDescription>
                    <Tag
                        style={{ marginBottom: '10px' }}
                        color="error"
                    >
                        Commentaires non fonctionnels
                    </Tag>
                    <TextArea placeholder="Commentaires" allowClear onChange={onCommentChange} />
                </div>
                <Button style={{ backgroundColor: '#151d3f', color: "#fff" }} htmlType="submit">
                    Continuer
                </Button>
            </styled.Form>
        </styled.GenerateContainer>
    );
};

export default First;
