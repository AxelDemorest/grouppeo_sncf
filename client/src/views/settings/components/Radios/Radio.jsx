import React, {useEffect, useState} from 'react';
import * as styled from "./Radio.styled";
import {BorderSeparator} from "../../../planning/planningList/components/PlanningItem/PlanningItem.styled";
import {Button, message, Popconfirm, Select} from "antd";
import axios from "axios";

const Radio = () => {
    const [values, setValues] = useState({
        number: "",
        agentNumber: 0,
        type: "",
    });
    const [radios, setRadios] = useState([]);

    // ---- PERIODS ----
    const [periods, setPeriods] = useState([]);

    useEffect(() => {
        try {
            const fetchRadios = async () => {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/radio`);
                setRadios(response.data)
            }

            const fetchPeriods = async () => {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/period`);
                setPeriods(response.data);
            }

            fetchRadios();
            fetchPeriods();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleDelete = async (item) => {
        await axios.delete(`${import.meta.env.VITE_API_HOST}/api/radio/${item.id}`);
        setRadios((current) =>
            current.filter((currentItem) => currentItem.id !== item.id)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (values.type === 'point') values.agentNumber = null;
        try {
            await axios.post(
                `${import.meta.env.VITE_API_HOST}/api/radio/`,
                values
            );
            message.success("La radios a bien été ajoutée");
            setRadios((current) => [...current, values]);
        } catch (error) {
            console.log(error);
            message.error("Une erreur est survenue");
        }
    }

    const columns = [
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <>
                    <Popconfirm
                        placement="topRight"
                        title={"Êtes vous sûr de vouloir supprimer cette radios ?"}
                        onConfirm={() => handleDelete(record)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button>
                            Supprimer
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
        {
            title: "Numéro de la radios",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "Numéro du renfort",
            dataIndex: "agentNumber",
            key: "agentNumber",
        },
        {
            title: "Numéro du point",
            dataIndex: ['meetingPoint', 'name'],
            key: "mpName",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
    ];

    const handleTypeChange = (value) => {
        setValues({ ...values, type: value })
    };

    return (
        <styled.Wrapper>
            <h2>Gestion des radios</h2>
            <p>Ajoutez et supprimez des radios et assignez les à des DPX ou des points de rendez-vous.</p>
            <BorderSeparator style={{ marginBottom: '10px' }} />
            <styled.AddRadio>
                <div style={{ width: '27%' }}>
                    <h3>Ajouter une radio</h3>
                    <styled.AddRadioDescription>Ajoutez des radios pour les assigner à des point de RDV ou des DPX.</styled.AddRadioDescription>
                </div>
                <styled.AddRadioForm onSubmit={handleSubmit}>
                    <styled.AddRadioFormInput
                        value={values.number}
                        onChange={e => setValues({ ...values, number: e.target.value })}
                        placeholder={'Numéro de la radios'}
                    />
                    {values.type === 'agent' && (
                        <styled.AddRadioFormInput
                            placeholder={'Numéro du renfort'}
                            type={'number'}
                            value={values.agentNumber}
                            onChange={(e) => setValues({ ...values, agentNumber: Number(e.target.value) })}
                        />
                    )}
                    <Select
                        style={{
                            marginBottom: '15px',
                            width: 200,
                            display: 'block',
                        }}
                        onChange={handleTypeChange}
                        placeholder="Choisissez à qui vous voulez créer la radio"
                        options={[
                            {
                                value: 'agent',
                                label: 'Renfort',
                            },
                            {
                                value: 'point',
                                label: 'Point',
                            },
                        ]}
                    />
                    <styled.SubmitRadioButton>Ajouter</styled.SubmitRadioButton>
                </styled.AddRadioForm>
            </styled.AddRadio>
            <h2 style={{ marginBottom: '10px' }}>Liste des radios</h2>
            <styled.CustomTable
                scroll={{ y: 920 }}
                columns={columns}
                dataSource={radios.map((obj) => ({
                    key: obj.id,
                    ...obj,
                }))}
            />
        </styled.Wrapper>
    );
};

export default Radio;
