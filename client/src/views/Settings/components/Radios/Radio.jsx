import React, {useEffect, useState} from 'react';
import * as styled from "./Radio.styled";
import {BorderSeparator} from "../../../Planning/PlanningList/components/PlanningItem/PlanningItem.styled";
import {Button, message, Popconfirm, Select} from "antd";
import axios from "axios";

const Radio = () => {
    const [values, setValues] = useState({
        number: "",
        period: "",
    });
    const [valuesAssign, setValuesAssign] = useState({
        radio_number: "",
        user_cp: "",
    });
    const [radios, setRadios] = useState([]);
    const [chooseOption, setChooseOption] = useState('assign_user');

    useEffect(() => {
        try {
            const fetchRadios = async () => {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/radio`);
                setRadios(response.data)
            }

            fetchRadios();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleDelete = async (item) => {
        await axios.delete(`${import.meta.env.VITE_API_HOST}/radio/${item.id}`);
        setRadios((current) =>
            current.filter((currentItem) => currentItem.id !== item.id)
        );
    };

    const handleAssign = async (event) => {
        event.preventDefault();
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_HOST}/user/radio/assign`,
                valuesAssign
            );
            message.success("La radio a bien été assignée");
        } catch (error) {
            console.log(error);
            message.error("Une erreur est survenue");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_HOST}/radio/`,
                values
            );
            message.success("La radio a bien été ajoutée");
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
                        title={"Êtes vous sûr de vouloir supprimer cette radio ?"}
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
            title: "Numéro de la radio",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "Période",
            dataIndex: "period",
            key: "period",
        },
    ];

    const handleChange = (value) => {
        setChooseOption(value);
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
                        placeholder={'Numéro de la radio'}
                    />
                    <styled.AddRadioFormInput
                        placeholder={'Période'}
                        value={values.period}
                        onChange={e => setValues({ ...values, period: e.target.value })}
                    />
                    <styled.SubmitRadioButton>Ajouter</styled.SubmitRadioButton>
                </styled.AddRadioForm>
            </styled.AddRadio>
            <BorderSeparator style={{ marginBottom: '10px' }} />
            <styled.AddRadio>
                <div style={{ width: '27%' }}>
                    <h3>Assigner une radio</h3>
                    <styled.AddRadioDescription>Assignez une radio à un point de RDV ou un DPX.</styled.AddRadioDescription>
                </div>
                <styled.AddRadioForm onSubmit={handleAssign}>
                    <Select
                        defaultValue="assign_user"
                        style={{
                            marginBottom: '15px'
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'assign_meeting_point',
                                label: 'Assigner à un DPX',
                            },
                            {
                                value: 'assign_user',
                                label: 'Assigner à un utilisateur',
                            },
                        ]}
                    />
                    <styled.AddRadioFormInput
                        placeholder={'Numéro de la radio'}
                        value={valuesAssign.radio_number}
                        onChange={e => setValuesAssign({ ...valuesAssign, radio_number: e.target.value })}
                    />
                    {
                        chooseOption === 'assign_user' ? (
                            <styled.AddRadioFormInput
                                placeholder={'CP du DPX'}
                                value={valuesAssign.user_cp}
                                onChange={e => setValuesAssign({ ...valuesAssign, user_cp: e.target.value })}
                            />
                        ) : (
                            <styled.AddRadioFormInput
                                placeholder={'Nom du point de RDV'}
                                value={valuesAssign.name}
                                onChange={e => setValuesAssign({ ...valuesAssign, user_cp: e.target.value })}
                            />
                        )

                    }
                    <styled.SubmitRadioButton>Assigner</styled.SubmitRadioButton>
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
