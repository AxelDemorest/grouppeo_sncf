import React from 'react';
import SideBar from '../../components/sideBar/SideBar';
import styled from 'styled-components';

const Container = ({children}) => {
    return (
        <Wrapper>
            <SideBar />
            <DashboardContainer>
                {children}
            </DashboardContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const DashboardContainer = styled.div`
    width: calc(100vw - 270px);
    background-color: #F9FAFE;
    min-height: 100vh;
`;

export default Container;