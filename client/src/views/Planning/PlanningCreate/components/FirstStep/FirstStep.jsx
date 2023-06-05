import React, {useState} from 'react';
import * as styled from "./FirstStep.styled";
import {Button, DatePicker, Form} from "antd";
import moment from "moment";

const FirstStep = ({ title, onFinish }) => {
    const [values, setValues] = useState({
        date: ''
    });
    const onChange = (date, dateString) => {
        const formatDate = new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
        setValues(values => ({...values, date: dateString}));
    };

    const onSubmit = () => {
      onFinish(values);
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
                    <styled.ShortDescription>Veuillez définir la journée de génération de programmation que vous souhaitez.</styled.ShortDescription>
                    <DatePicker
                        defaultValue={values.date}
                        onChange={onChange}
                        style={{ width: '30%', marginRight: '20px' }}
                    />
                    <Button style={{ backgroundColor: '#151d3f', color: "#fff" }} htmlType="submit">
                        Continuer
                    </Button>
            </styled.Form>
        </styled.GenerateContainer>
    );
};

export default FirstStep;
