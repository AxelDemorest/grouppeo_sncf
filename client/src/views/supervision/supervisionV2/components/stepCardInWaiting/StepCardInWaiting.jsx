import React from 'react';
import * as styled from "../../SupervisionV2.styled";
import { BiLoaderAlt } from 'react-icons/bi';
import {Button} from "antd";

const StepCardInWaiting = ({ currentGroup, status, onClick }) => {
    return (
        <styled.StepCardInWaiting key={status.id}>
            <styled.Icon>
                <BiLoaderAlt size={22} color={'#7D8699'} />
            </styled.Icon>
            <styled.StepCardTitle>Étape {status.id}</styled.StepCardTitle>
            <styled.StepCardDescription>{status.title}</styled.StepCardDescription>
            <styled.StepCardTag>En attente</styled.StepCardTag>
            <Button onClick={() => onClick(currentGroup.group_id, status.id)}>Valider l'étape</Button>
        </styled.StepCardInWaiting>
    );
};

export default StepCardInWaiting;
