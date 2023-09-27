import React, {useEffect, useState} from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BsFillBriefcaseFill } from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa';
import { MdGroup } from 'react-icons/md';
import * as styled from "./PlanningItem.styled";
import moment from "moment/moment";
import axios from "axios";
import {Button, Popconfirm} from "antd";
import {Link} from "react-router-dom";

const PlanningItem = ({ item, getPlannings }) => {
    const [groupCount, setGroupCount] = useState(0);
    const [agentCount, setAgentCount] = useState(0);

    const formatDate = item.planning_day.replace(new RegExp('/', 'g'), '-');

    useEffect(() => {
        const getCountOfGroups = () => {
            axios.get(`${import.meta.env.VITE_API_HOST}/api/group/date/${formatDate}?supported=true`).then((res) => {
                setGroupCount(res.data);
            }).catch((err) => console.error(err));
        }

        const getCountOfAgents = () => {
            axios.get(`${import.meta.env.VITE_API_HOST}/api/planning/day/${formatDate}/agents/count`).then((res) => {
                setAgentCount(res.data);
            }).catch((err) => console.error(err));
        }

        getCountOfGroups();
        getCountOfAgents();
    }, [formatDate, item])

    const onPlanningDelete = () => {
        axios.delete(`${import.meta.env.VITE_API_HOST}/api/planning/day/${formatDate}`).then((res) => {
            getPlannings();
        }).catch((err) => console.error(err));
    }

    return (
        <styled.Container>
            <styled.Date>
                <styled.DayNumber>{formatDate.split('-')[0]}</styled.DayNumber>
                <p style={{ marginBottom: '0' }}>{moment(formatDate.split('-')[1], 'MM').format('MMMM')}</p>
            </styled.Date>
            <styled.Details>
                <div>
                    <styled.Title>
                        <styled.Square />
                        <p>Programmation du {formatDate}</p>
                    </styled.Title>
                    <styled.Statistics>
                        <p><MdGroup color={'#9BA3AE'} size={18} style={{ marginRight: '7px', marginBottom: '4px' }} /> {groupCount} groupes</p>
                        <p><BsFillBriefcaseFill color={'#9BA3AE'} size={17} style={{ marginRight: '7px', marginBottom: '4px' }} /> {agentCount} agents</p>
                    </styled.Statistics>
                </div>
                <div>
                    <Link to={`/date/${formatDate}/planning`}>
                        <Button style={{ marginRight: '15px' }}>Modifier</Button>
                    </Link>
                    <Popconfirm
                        title="Supprimer le planning"
                        description="Êtes-vous sûr de vouloir supprimer ce planning ?"
                        onConfirm={onPlanningDelete}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button danger>Supprimer</Button>
                    </Popconfirm>
                </div>
            </styled.Details>
        </styled.Container>
    )
};

export default PlanningItem;
