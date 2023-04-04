import React from 'react';
import {Button, message} from "antd";
import * as styled from "./GroupInformation.styled";
import axios from "axios";

const GroupInformation = ({ obj }) => {
    const [toggleInformation, setToggleInformation] = React.useState(false);

    const statuses = [
        { id: 1, title: 'Groupe arrivé' },
        { id: 2, title: 'Groupe pris en charge' },
        { id: 3, title: 'Groupe installé' },
    ];

    const handleToggleInformation = () => {
        setToggleInformation(!toggleInformation);
    }

    const createStatus = async (statusId) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_HOST}/api/group-status/${obj.group_id}/statuses/${statusId}`);
            message.success('Statut mis à jour');
        } catch (error) {
            console.log(error);
            message.error('Une erreur est survenue');
        }
    }

    return (
        <styled.GroupWrapper key={obj.group_id}>
            <h3>Nom : {obj.group_name}</h3>
            <p>Destination : {obj.group_destination}</p>
            {!toggleInformation ?
                <Button onClick={handleToggleInformation}>Voir plus</Button>
            : (
                <>
                    <p>Nom : {obj.group_name}</p>
                    <p>Destination : {obj.group_destination}</p>
                    <p>Heure de départ : {obj.group_train.train_hour}</p>
                    <p>Numéro du train : {obj.group_train.train_number}</p>
                    <p>Voie : {obj.group_train.train_track || 'Aucune voie annoncée pour le moment'}</p>
                    <p>Total voyageurs : {obj.group_total_travellers}</p>
                    <p>N° Voiture : {obj.group_car_number}</p>
                    <p>Prestation : {obj.group_prestation || 'Aucune prestation'}</p>
                    <p>Point RV : {obj.group_meeting_point}</p>
                    <p>Heure RV : {obj.group_meeting_time}</p>
                    <p>Responsable JDD : {obj.group_responsable_departure_day}</p>
                    <p>Tel. responsable JDD : {obj.group_responsable_phone_departure_day}</p>
                    <Button onClick={handleToggleInformation}>Voir moins</Button>
                </>
            )}
            <styled.ButtonList>
                <>
                    {statuses.map((status) => (
                        <button key={status.id} onClick={() => createStatus(status.id)}>{status.title}</button>
                    ))}
                </>
            </styled.ButtonList>
        </styled.GroupWrapper>
    );
};

export default GroupInformation;
