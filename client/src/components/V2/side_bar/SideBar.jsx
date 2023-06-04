import React, {useContext, useMemo} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { TfiStatsUp } from 'react-icons/tfi';
import { FiHelpCircle } from 'react-icons/fi';
import { BsListCheck, BsBriefcase } from 'react-icons/bs';
import { RiMapPinTimeLine } from 'react-icons/ri';
import { AiOutlineUsergroupDelete, AiOutlineUsergroupAdd, AiOutlineEye, AiOutlineUserAdd, AiOutlineSetting } from 'react-icons/ai';
import logo from '../../../assets/GrouppeoSideBar.png';
import './sideBar.css';
import {AuthContext} from "../../../context/AuthContext";

const SideBar = ({ showSideBar, toggleSideBar }) => {

    const { user } = useContext(AuthContext);

    const navItems = useMemo(() => [
        {
            role: "Administrateur",
            items: [
                { to: "/", icon: <TfiStatsUp className="sideBarIcon" />, label: "Tableau de bord" },
                { to: "/groupes-autonomes", icon: <AiOutlineUsergroupDelete className="sideBarIcon" />, label: "Groupes autonomes" },
                { to: "/groupes-pris-en-charge", icon: <AiOutlineUsergroupAdd className="sideBarIcon" />, label: "Groupes pris en charge" },
                { to: "/supervision", icon: <AiOutlineEye className="sideBarIcon" />, label: "Supervision" },
                { to: "/liste-des-plannings", icon: <BsListCheck className="sideBarIcon" />, label: "Les plannings" },
                { to: "/gestion-des-utilisateurs", icon: <AiOutlineUserAdd className="sideBarIcon" />, label: "Gestion des utilisateurs" },
                { to: "/gestion-des-agents", icon: <BsBriefcase className="sideBarIcon" />, label: "Gestion des agents" },
                { to: "/planning", icon: <RiMapPinTimeLine className="sideBarIcon" />, label: "Mon espace agent" },
            ],
        },
        {
            role: "Agent",
            items: [
                { to: "/", icon: <TfiStatsUp className="sideBarIcon" />, label: "Tableau de bord" },
                { to: "/planning", icon: <RiMapPinTimeLine className="sideBarIcon" />, label: "Mon espace agent" },
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
                <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 35px' }}>
                    <Logo src={logo} alt="Logo" width='18%'></Logo>
                </div>
                <NavItems className='navItems' onClick={toggleSideBar}>
                    <>
                        {navItemsByRole.map((item, index) => (
                            <NavLink key={index} to={item.to}>
                                {item.icon} {item.label}
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
  background-color: #151d3f;
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

const Logo = styled.img`
    margin-top: 30px;
    border-radius: 5px;
`;

const NavItems = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; 
    padding: 0;
    height: 75%;
    width: 100%;
    margin-top: 80px;
`

const NavLink = styled(Link)`
    &:hover {
        color: #e8eaed;
    }
    transition: color 0.2s, background-color 0.2s;
    cursor: pointer;
    border-radius: 10px;
    font-size: 16.5px;
    width: 100%;
    padding: 13px 0;
    text-align: center;
    color: #8e91a3;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-bottom: 25px;
`;

const NavLinkFooter = styled(NavLink)`
  margin-top: 10px;
  margin-bottom: 0;
`;

const Footer = styled.div`
  width: 92%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

export default SideBar;
