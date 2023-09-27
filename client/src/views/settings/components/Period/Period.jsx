import React, {useEffect, useState} from 'react';
import {BorderSeparator} from "../../../planning/planningList/components/PlanningItem/PlanningItem.styled";
import * as styled from "../Radios/Radio.styled";
import axios from "axios";
import {message} from "antd";

const Period = () => {
    const [name, setName] = useState("");
    const [periods, setPeriods] = useState([]);

    useEffect(() => {
        try {
            const fetchPeriod = async () => {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/period`);
                setPeriods(response.data)
            }

            fetchPeriod();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_HOST}/api/period/`,
                {
                    name: name
                }
            );
            message.success("La période a bien été ajoutée");
            setPeriods((current) => [...current, {name: name}]);
        } catch (error) {
            console.log(error);
            message.error("Une erreur est survenue");
        }
    }

    const columns = [
        {
            title: "Nom de la période",
            dataIndex: "name",
            key: "name",
        },
    ];

    return (
        <styled.Wrapper>
            <h2>Gestion des périodes</h2>
            <BorderSeparator style={{ marginBottom: '10px' }} />
            <styled.AddRadio>
                <div style={{ width: '27%' }}>
                    <h3>Ajouter une période</h3>
                    <styled.AddRadioDescription>Ajoutez des périodes (saisons de départ)</styled.AddRadioDescription>
                </div>
                <styled.AddRadioForm onSubmit={handleSubmit}>
                    <styled.AddRadioFormInput placeholder={'Nom de la période'} value={name} onChange={(e) => setName(e.target.value)} />
                    <styled.SubmitRadioButton>Ajouter</styled.SubmitRadioButton>
                </styled.AddRadioForm>
            </styled.AddRadio>
            <h2 style={{ marginBottom: '10px' }}>Liste des périodes</h2>
            <styled.CustomTable
                scroll={{ y: 920 }}
                columns={columns}
                dataSource={periods.map((obj) => ({
                    key: obj.id,
                    ...obj,
                }))}
            />
        </styled.Wrapper>
    );
};

export default Period;
