import React from 'react';
import * as styled from '../Dashboard.styled';
import { IoMdTrain } from 'react-icons/io';

const StatsBox = ({ iconColor, borderColor, icon, label, count }) => (
    <styled.Box>
        <styled.BoxHeader>
            <styled.WrapperIcon color={iconColor} border={borderColor}>
                <IoMdTrain size={25} color={borderColor} />
            </styled.WrapperIcon>
            <p>{label}</p>
        </styled.BoxHeader>
        <styled.BoxBody>
            <p>{count}</p>
            <span>Aujourd'hui</span>
        </styled.BoxBody>
    </styled.Box>
);

export default StatsBox;
