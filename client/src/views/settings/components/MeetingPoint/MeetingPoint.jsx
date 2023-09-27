import React, {useEffect, useState} from 'react';
import {BorderSeparator} from "../../../planning/planningList/components/PlanningItem/PlanningItem.styled";
import * as styled from "../Radios/Radio.styled";
import axios from "axios";
import {Button, message, Popconfirm, Select} from "antd";

const MeetingPoint = () => {
    const [name, setName] = useState("");
    const [meetingPoints, setMeetingPoints] = useState([]);
    const [radios, setRadios] = useState([]);

    useEffect(() => {
        try {
            const fetchMeetingPoint = async () => {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/meeting-point`);
                setMeetingPoints(response.data)
            }

            const fetchRadios = async () => {
                const response = await axios.get(`${import.meta.env.VITE_API_HOST}/api/radio/type/point`);
                setRadios(response.data)
            }

            fetchMeetingPoint();
            fetchRadios();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleDelete = async (item) => {
        await axios.delete(`${import.meta.env.VITE_API_HOST}/api/meeting-point/${item.id}`);
        setMeetingPoints((current) =>
            current.filter((currentItem) => currentItem.id !== item.id)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_API_HOST}/api/meeting-point/`,
                {
                    name: name
                }
            );
            message.success("Le point de rendez-vous a bien été ajouté");
            setMeetingPoints((current) => [...current, {name: name}]);
        } catch (error) {
            console.log(error);
            message.error("Une erreur est survenue");
        }
    }

    const onChangeRadio = async (value, item) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_HOST}/api/meeting-point/${item.id}`,
                {
                    name: item.name,
                    radioId: value
                }
            );
            message.success("La radios a bien été assigné");
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
                        title={"Êtes vous sûr de vouloir supprimer ce point de RDV ?"}
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
            title: "Nom du point de RDV",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Radio associée",
            dataIndex: ["radio", "number"],
            key: "radio",
            render: (text, record) => (
                <Select
                    style={{
                        marginBottom: '15px',
                        width: 200
                    }}
                    defaultValue={record.radio ? record.radio.id : null}
                    onChange={(value) => onChangeRadio(value, record)}
                    placeholder="Choisissez une période"
                    options={radios.map(radio => ({
                        value: radio.id,
                        label: radio.number,
                    }))}
                />
            ),
        },
    ];

    return (
        <styled.Wrapper>
            <h2>Gestion des points de rendez-vous</h2>
            <p>Ajoutez et supprimez des points de rendez-vous</p>
            <BorderSeparator style={{ marginBottom: '10px' }} />
            <styled.AddRadio>
                <div style={{ width: '27%' }}>
                    <h3>Ajouter un point de rendez-vous</h3>
                    <styled.AddRadioDescription>Ajoutez des points de rendez-vous pour les groupes de voyageurs.</styled.AddRadioDescription>
                </div>
                <styled.AddRadioForm onSubmit={handleSubmit}>
                    <styled.AddRadioFormInput placeholder={'Nom du point de RDV'} value={name} onChange={(e) => setName(e.target.value)} />
                    <styled.SubmitRadioButton>Ajouter</styled.SubmitRadioButton>
                </styled.AddRadioForm>
            </styled.AddRadio>
            <h2 style={{ marginBottom: '10px' }}>Liste des points de rendez-vous</h2>
            <styled.CustomTable
                scroll={{ y: 920 }}
                columns={columns}
                dataSource={meetingPoints.map((obj) => ({
                    key: obj.id,
                    ...obj,
                }))}
            />
        </styled.Wrapper>
    );
};

export default MeetingPoint;
