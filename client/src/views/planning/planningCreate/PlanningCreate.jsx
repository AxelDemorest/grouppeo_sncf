import React, {useState} from 'react';
import * as styled from "./PlanningCreate.styled";
import logo from "../../../assets/GrouppeoSideBar.png";
import First from "./components/steps/First/First";
import Third from "./components/steps/Third/Third";
import Four from "./components/steps/Four/Four";
import {useNavigate} from "react-router-dom";
import Second from "./components/steps/Second/Second";

const PlanningCreate = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [planningValues, setPlanningValues] = useState({
        date: '',
        numAgents: 0,
    });
    const [steps, setSteps] = useState([
        {
            title: 'Configuration',
            status: 'todo',
        },
        {
            title: 'Radios',
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

    const onFinish = (values = {}) => {
        const newSteps = [...steps];
        newSteps[page].status = 'finish';
        setCurrentStep(currentStep + 1);
        if (page === 0) {
            console.log(values.numAgents);
            setPlanningValues({ numAgents: values.numAgents, date: values.date });
        }
        setPage(page + 1);
    };

    const componentList = [
        <First title={'Configuration'} onFinish={onFinish} />,
        <Second title={'Radios'} onFinish={onFinish} />,
        <Third title={'Vérification'} onFinish={onFinish} day={planningValues.date} />,
        <Four title={'Finalisation'} onFinish={onFinish} day={planningValues.date} numAgents={planningValues.numAgents} />
    ];

    return (
        <styled.Container>
            <styled.Close onClick={() => {
                navigate('/gestion-des-agents', { replace: true });
            }}>Fermer</styled.Close>
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
