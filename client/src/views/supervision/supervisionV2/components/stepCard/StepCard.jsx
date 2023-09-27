import React from 'react';
import * as styled from "../../SupervisionV2.styled";
import { BiCheck } from 'react-icons/bi';

const StepCard = ({ status }) => {
    return (
        <styled.StepCard key={status.id}>
            <styled.IconSuccess>
                <BiCheck size={22} color={'#fff'} />
            </styled.IconSuccess>
            <styled.StepCardTitle>Étape {status.id}</styled.StepCardTitle>
            <styled.StepCardDescription>{status.title}</styled.StepCardDescription>
            <styled.StepCardTagSuccess>Terminé</styled.StepCardTagSuccess>
        </styled.StepCard>
    );
};

export default StepCard;
