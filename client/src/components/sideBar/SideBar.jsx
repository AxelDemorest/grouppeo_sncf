import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IoMegaphoneSharp } from 'react-icons/io5';
import { MdOutlineDashboard } from 'react-icons/md';
import { MdGroups } from 'react-icons/md';
import { FaChild, FaUserEdit, FaThList } from 'react-icons/fa';
import { GiCaptainHatProfile } from 'react-icons/gi';
import { AiFillCalendar } from 'react-icons/ai';
import logo from '../../assets/Grouppeo.png';
import './sideBar.css';

const SideBar = ({ showSideBar, toggleSideBar }) => {

    return (
        <SideBarContainer showSideBar={showSideBar}>
            <StickyContainer>
                <Logo src={logo} alt="Logo" width='40%'></Logo>
                <NavItems className='navItems' onClick={toggleSideBar}>
                    <NavLink to="/"><MdOutlineDashboard className="sideBarIcon" /> Tableau de bord</NavLink>
                    <SideBarSeparator />
                    <SectionTitle>Gestion</SectionTitle>
                    <NavLink to="/groupes-autonomes"><MdGroups className="sideBarIcon" /> Groupes autonomes</NavLink>
                    <NavLink to="/groupes-pris-en-charge"><IoMegaphoneSharp className="sideBarIcon" /> Groupes pris en charge</NavLink>
                    <SideBarSeparator />
                    <SectionTitle>Supervision</SectionTitle>
                    <NavLink to="/gestion-des-utilisateurs"><FaUserEdit className="sideBarIcon" /> Supervision des groupes</NavLink>
                    <SideBarSeparator />
                    <SectionTitle>Plannings</SectionTitle>
                    <NavLink to="/liste-des-plannings"><FaThList className="sideBarIcon" /> Liste des plannings</NavLink>
                    <NavLink to="/planning"><AiFillCalendar className="sideBarIcon" /> Mon espace planning</NavLink>
                    <SideBarSeparator />
                    <SectionTitle>Administration</SectionTitle>
                    <NavLink to="/gestion-des-utilisateurs"><FaUserEdit className="sideBarIcon" /> Gestion des utilisateurs</NavLink>
                    <NavLink to="/gestion-des-agents"><GiCaptainHatProfile className="sideBarIcon" /> Gestion des agents</NavLink>
                </NavItems>
            </StickyContainer>
        </SideBarContainer>
    );
};

const SideBarContainer = styled.div`
  width: 270px;
  z-index: 1;
  background-color: #FFFFFF;
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
  align-items: center;
  position: sticky;
  top: 0px;
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

const SectionTitle = styled.p`
  text-align: start;
  width: 80%;
  margin: 10px 0 0 0;
  font-weight: 500;
  color: #a8a8a8;
`;

export default SideBar;