import React, {useState} from 'react';
import SideBar from '../../components/V2/side_bar/SideBar';
import styled from 'styled-components';
import { MdOutlineContactSupport } from 'react-icons/md';

import { GiHamburgerMenu } from 'react-icons/gi';
import Header from "../Layouts/Header/Header";

const Container = ({children, title}) => {
    const [showSideBar, setShowSideBar] = useState(false);
    const toggleSideBar = () => setShowSideBar(!showSideBar);

    return (
        <>
            <ToggleBar>
                <GiHamburgerMenu size={20} style={{ cursor: 'pointer' }} onClick={toggleSideBar} />
            </ToggleBar>
            <Wrapper>
                <SideBar showSideBar={showSideBar} toggleSideBar={toggleSideBar} />
                <DashboardContainer>
                    <Header title={title} />
                    {children}
                    <FixedButton><MdOutlineContactSupport size={27} /></FixedButton>
                </DashboardContainer>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const DashboardContainer = styled.div`
    width: 100vw;
    background-color: #F8F8F8;
    min-height: 100vh;
    padding-left: 270px;
  @media (max-width: 992px) {
    left: ${({ showSideBar }) => (showSideBar ? "0" : "-100%")};
    padding-left: 0;
    overflow-x: scroll;
  }
`;

const ToggleBar = styled.div`
  background-color: #fff;
  height: 50px;
  display: none;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  @media (max-width: 992px) {
    display: flex;
  }
`;

const FixedButton = styled.button`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #151d3f;
    height: 50px;
    cursor: pointer;
    width: 50px;
    color: #fff;
    border-radius: 50%;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
`;

export default Container;
