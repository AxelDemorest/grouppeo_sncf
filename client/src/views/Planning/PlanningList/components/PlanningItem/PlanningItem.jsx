import React, {useEffect, useState} from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BsFillBriefcaseFill } from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa';
import { MdGroup } from 'react-icons/md';
import * as styled from "./PlanningItem.styled";
import axios from "axios";

const PlanningItem = ({ item }) => {
    const [groupCount, setGroupCount] = useState(0);
    const [agentCount, setAgentCount] = useState(0);

    const formatDate = item.planning_day.replace(new RegExp('/', 'g'), '-');

    useEffect(() => {
        const getCountOfGroups = () => {
            axios.get(`${import.meta.env.VITE_API_HOST}/group/date/${formatDate}`).then((res) => {
                setGroupCount(res.data);
            }).catch((err) => console.error(err));
        }

        const getCountOfAgents = () => {
            axios.get(`${import.meta.env.VITE_API_HOST}/user/day/agents/count/${formatDate}`).then((res) => {
                setAgentCount(res.data);
            }).catch((err) => console.error(err));
        }

        getCountOfGroups();
        getCountOfAgents();
    }, [formatDate, item])

    return (
        <styled.Container to={`/planning-details/date/${formatDate}`}>
            <styled.Title>
                <styled.Square />
                <p>Programmation du {formatDate} <span style={{ color: '#6D7481' }}>#ski_2023</span></p>
                <styled.Tag><AiFillCheckCircle style={{ marginRight: '5px' }} color={'#029652'} /> Validée</styled.Tag>
            </styled.Title>
            <styled.Statistics>
                <p><FaUserCheck color={'#9BA3AE'} size={17} style={{ marginRight: '7px' }} /> Axel DEMOREST</p>
                <p><MdGroup color={'#9BA3AE'} size={18} style={{ marginRight: '7px' }} /> {groupCount} groupes</p>
                <p><BsFillBriefcaseFill color={'#9BA3AE'} size={17} style={{ marginRight: '7px' }} /> {agentCount} agents</p>
            </styled.Statistics>
            <styled.BorderSeparator />
            <styled.FooterItem>
                <styled.Steptag>Programmation complète</styled.Steptag>
            </styled.FooterItem>
        </styled.Container>
    )
};

export default PlanningItem;
