import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoHome, IoMegaphoneSharp } from 'react-icons/io5';
import { MdOutlineDashboard } from 'react-icons/md';
import { MdGroups } from 'react-icons/md';
import { FaChild, FaUserEdit } from 'react-icons/fa';
import { GiCaptainHatProfile } from 'react-icons/gi';
import logo from '../../assets/Grouppeo.png';
import './sideBar.css';

const SideBar = () => {
    return (
        <SideBarContainer>
            <Logo src={logo} alt="Logo" width='40%'></Logo>
            <NavItems className='navItems'>
                <NavLink to="/"><IoHome className="sideBarIcon" /> Accueil</NavLink>
                <NavLink to="/"><MdOutlineDashboard className="sideBarIcon" /> Tableau de bord</NavLink>
                <NavLink to="/groupes-autonomes"><MdGroups className="sideBarIcon" /> Groupes autonomes</NavLink>
                <NavLink to="/groupes-pris-en-charge"><IoMegaphoneSharp className="sideBarIcon" /> Groupes pris en charges</NavLink>
                <NavLink to="/"><FaChild className="sideBarIcon" /> Junior & co</NavLink>
                <SideBarSeparator />
                <NavLink to="/"><FaUserEdit className="sideBarIcon" /> Gestion des utilisateurs</NavLink>
                <NavLink to="/"><GiCaptainHatProfile className="sideBarIcon" /> Gestion des agents</NavLink>
            </NavItems>
        </SideBarContainer>
    );
};

const SideBarContainer = styled.div`
  width: 270px;
  height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const Logo = styled.img`
    margin-top: 20px;
    border-radius: 15px;
`;

const NavItems = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    width: 100%;
    margin-top: 25px;
`

const NavLink = styled(Link)`
    &:hover {
        background-color: #e6c3cf;
        color: #a63f62;
    }
    transition: color 0.2s, background-color 0.2s;
    cursor: pointer;
    border-radius: 10px;
    font-size: 15px;
    width: 92%;
    padding: 13px 0;
    text-align: center;
    color: #8d8d8d;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const SideBarSeparator = styled.hr`
    width: 70%;
    border: 0.1px solid #f1f1f1;
    margin: 0 0 5px 0;
`;

export default SideBar;