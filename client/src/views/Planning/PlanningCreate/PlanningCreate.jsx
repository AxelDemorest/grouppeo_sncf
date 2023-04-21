import React, {useState} from 'react';
import * as styled from "./PlanningCreate.styled";
import logo from "../../../assets/GrouppeoSideBar.png";
import FirstStep from "./components/FirstStep/FirstStep";
import {Button, Form} from "antd";

const PlanningCreate = () => {
    const [form] = Form.useForm();
    const [page, setPage] = useState(0);
    const [steps, setSteps] = useState([
        {
            title: 'Configuration',
            status: 'todo',
        },
        {
            title: 'Vérification',
            status: 'todo',
        },
        {
            title: 'Finalisation',
            status: 'todo',
        },

    ]);

    const onFinish = (values) => {
        form.validateFields().then(() => {
            const newSteps = [...steps];
            newSteps[page].status = 'finish';
            setPage(page + 1);
        });
    };

    const componentList = [
        <FirstStep title={'Configuration'} onFinish={onFinish} />,
        <>sss</>,
        <>ssdddss</>
    ];












    const [currentStep, setCurrentStep] = useState(0);


    return (
        <styled.Container>
            <styled.Col>
                <styled.Logo src={logo} alt="Logo" width='100px'></styled.Logo>
                <styled.Title>Générez votre programmation de renforts</styled.Title>
                <styled.Description>Génération des programmations des renforts pour journée prédéfinie. Suivez les étapes en configurant les options et laissez l'algorithme faire le travail !</styled.Description>
                <styled.StepList>
                    <>
                        {steps.map((step, index) => (
                            <styled.StepContainer key={step.title}>
                                <styled.StepBar status={step.status} current={index === currentStep} />
                                <styled.StepNumber status={step.status} current={index === currentStep}>Étape {index + 1}</styled.StepNumber>
                                <styled.StepName>{step.title}</styled.StepName>
                            </styled.StepContainer>
                        ))}
                    </>
                </styled.StepList>
                {componentList[page]}
            </styled.Col>
        </styled.Container>
    );
};

export default PlanningCreate;
