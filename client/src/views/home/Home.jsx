import React from 'react';
import styled from 'styled-components';

const Home = () => {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

    return (
        <div>
            <DashboardTitle>Tableau de bord</DashboardTitle>
            <CurrentDate>{date}</CurrentDate>
        </div>
    );
};

const DashboardTitle = styled.h1`
    font-weight: 900;
    margin: 0;
    color: #313131;
`;

const CurrentDate = styled.p`
    color: #BBC3D5;
    font-weight: 700;
    margin: 0 5px;
`;

export default Home;