import React, {useContext, useMemo} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TfiStatsUp } from 'react-icons/tfi';
import { FiHelpCircle, FiRadio } from 'react-icons/fi';
import { BsListCheck, BsBriefcase } from 'react-icons/bs';
import { RiMapPinTimeLine } from 'react-icons/ri';
import { AiOutlineUsergroupDelete, AiOutlineUsergroupAdd, AiOutlineEye, AiOutlineUserAdd, AiOutlineSetting } from 'react-icons/ai';
import logo from '../../../assets/GrouppeoSideBar.png';
import './sideBar.css';
import {AuthContext} from "../../../context/AuthContext";
import jwt_decode from "jwt-decode";

const SideBar = ({ showSideBar, toggleSideBar }) => {

    const { token } = useContext(AuthContext);
    const user = jwt_decode(token);

    const navItems = useMemo(() => [
        {
            role: "Administrateur",
            items: [
                { to: "/", icon: <TfiStatsUp className="sideBarIcon" />, label: "Tableau de bord" },
                { to: "/groupes-autonomes", icon: <AiOutlineUsergroupDelete className="sideBarIcon" />, label: "Groupes autonomes" },
                { to: "/groupes-pris-en-charge", icon: <AiOutlineUsergroupAdd className="sideBarIcon" />, label: "Groupes pris en charge" },
                { to: "/supervision", icon: <AiOutlineEye className="sideBarIcon" />, label: "Supervision" },
                { to: "/liste-des-plannings", icon: <BsListCheck className="sideBarIcon" />, label: "Les plannings" },
                { to: "/gestion-des-radios", icon: <FiRadio className="sideBarIcon" />, label: "Gestion des radios" },
                { to: "/gestion-des-agents", icon: <BsBriefcase className="sideBarIcon" />, label: "Gestion des agents" },
                { to: "/gestion-des-utilisateurs", icon: <AiOutlineUserAdd className="sideBarIcon" />, label: "Gestion des utilisateurs" },
            ],
        },
        {
            role: "Agent",
            items: [
                { to: "/", icon: <TfiStatsUp className="sideBarIcon" />, label: "Tableau de bord" },
            ],
        },
        {
            role: "UO service",
            items: [
                { to: "/", icon: <TfiStatsUp className="sideBarIcon" />, label: "Tableau de bord" },
                { to: "/groupes-autonomes", icon: <AiOutlineUsergroupDelete className="sideBarIcon" />, label: "Groupes autonomes" },
                { to: "/groupes-pris-en-charge", icon: <AiOutlineUsergroupAdd className="sideBarIcon" />, label: "Groupes pris en charge" },
                { to: "/supervision", icon: <AiOutlineEye className="sideBarIcon" />, label: "Supervision" },
                { to: "/liste-des-plannings", icon: <BsListCheck className="sideBarIcon" />, label: "Les plannings" },
                { to: "/gestion-des-agents", icon: <BsBriefcase className="sideBarIcon" />, label: "Gestion des agents" },
            ],
        },
    ], []);

    const navItemsByRole = useMemo(() => {
        const defaultNavItems = [{ to: "/", icon: <TfiStatsUp className="sideBarIcon" />, label: "Tableau de bord" }];
        const currentRoleNavItems = navItems.find((item) => item.role === user?.role)?.items || [];

        return currentRoleNavItems.length > 0 ? currentRoleNavItems : defaultNavItems;
    }, [navItems, user?.role]);

    return (
        <SideBarContainer showSideBar={showSideBar}>
            <StickyContainer>
                <Header>
                    <Logo src={logo} alt="Logo" width='18%' />
                    <h1>Grouppeo</h1>
                </Header >
                <User>
                    <p style={{ marginBottom: '10px' }}>{user.email}</p>
                    <p style={{ color: '#95959b' }}>{user.role}</p>
                </User>
                <NavItems className='navItems' onClick={toggleSideBar}>
                    <>
                        {navItemsByRole.map((item, index) => (
                            <NavLink key={index} to={item.to}>
                                <span>{item.icon}</span> {item.label}
                            </NavLink>
                        ))}
                    </>
                </NavItems>
                <Footer>
                    {user?.role === "Administrateur" || user?.role === "UO service" ? (
                        <NavLinkFooter to="/settings"><AiOutlineSetting className="sideBarIcon" /> Réglages</NavLinkFooter>
                    ) : null}
                    <NavLinkFooter to="/"><FiHelpCircle className="sideBarIcon" /> Informations</NavLinkFooter>
                </Footer>
            </StickyContainer>
        </SideBarContainer>
    );
};

const SideBarContainer = styled.div`
  width: 270px;
  z-index: 1;
  background-color: #2F3349;
  position: fixed;
  left: 0;
  height: 100%;
  @media (max-width: 992px) {
    left: ${({ showSideBar }) => (showSideBar ? "0" : "-100%")};
    transition: ${({ showSideBar }) => (showSideBar ? "450ms" : "850ms")};
  }
`;

const StickyContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  align-items: center;
  top: 0;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 31px 31px 31px;
  margin-top: 30px;
  border-bottom: 1px solid #434551;

  h1 {
    font-size: 1.7rem;
    margin: 4px 0 0 15px;
    color: white;
    font-family: 'MontserratRegular', sans-serif;
    letter-spacing: -1px;
    font-weight: bold;
  }
`;

const Logo = styled.img`
  border-radius: 5px;
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgb(52, 57, 81);
  border: 1px solid #515466;
  border-radius: 10px;
  color: white;
  padding: 0 15px;
  margin: 30px 0 20px 0;
  width: 85%;
  height: 100px;
  
  p {
    margin: 0;
  }
`;

const NavItems = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; 
  padding: 0;
  height: 75%;
  width: 100%;
`

const NavLink = styled(Link)`
    &:hover {
        color: #e8eaed;
        background: #34394D;
    }
    transition: color 0.2s, background-color 0.2s;
    cursor: pointer;
    font-size: 16.5px;
    width: 100%;
    padding: 20px 0 20px 14px;
    text-align: center;
    color: #9A9CB7;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
  
  span svg {
    margin-right: 12px;
    margin-bottom: 0;
  }
`;

const NavLinkFooter = styled(NavLink)`
  margin-top: 10px;
  margin-bottom: 0;
`;

const Footer = styled.div`
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

export default SideBar;
