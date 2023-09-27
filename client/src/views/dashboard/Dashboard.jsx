import React from 'react';
import * as styled from './Dashboard.styled';

import {useDashboardData} from "../../hooks/useDashboardData/useDashboardData";
import Container from '../../components/container/Container';
import BarChart from "../../components/Charts/TabChart";
import StatsBox from "./components/StatsBox";
import { IoMdTrain } from 'react-icons/io';

import {Chart as ChartJS, ArcElement, Legend, Tooltip, CategoryScale, LinearScale, BarElement} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const statistics = useDashboardData();

    const createDataset = (data, label) => ({
        labels: data?.map(item => item.date),
        datasets: [{
            label,
            data: data?.map(item => item.count),
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            tension: 0.3
        }]
    });

    return (
        <Container title={'Tableau de bord'} header={false}>
            <styled.Banner />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <styled.Content>
                    <styled.BodyStatContainer>
                        <styled.Side>
                            <styled.Row>
                                <StatsBox
                                    iconColor="#d9def4"
                                    borderColor="#7684CB"
                                    icon={IoMdTrain}
                                    label="Groupes pris en charge"
                                    count={statistics.groupCount}
                                />
                                <StatsBox
                                    iconColor="#ecf6e9"
                                    borderColor="#a3c39b"
                                    icon={IoMdTrain}
                                    label="Groupes autonomes"
                                    count={statistics.autonomousGroupCount}
                                />
                            </styled.Row>
                            <styled.GraphicBox>
                                <styled.HeaderGraphicBox>
                                    <h2>Groupes</h2>
                                </styled.HeaderGraphicBox>
                                <BarChart chartData={createDataset(statistics.groupsData, "Groupes")} />
                            </styled.GraphicBox>
                            <styled.News>
                                <h2>Nouveautés</h2>
                                <styled.UpdateItem>
                                    <h3>Mise à jour du 02/08/2023</h3>
                                    <p>
                                        - Ajout de la fonctionnalité de gestion des groupes<br/>
                                        - Ajout de la fonctionnalité de gestion des agents<br/>
                                        - Ajout de la fonctionnalité de gestion des trains<br/>
                                        - Ajout de la fonctionnalité de gestion des renforts<br/>
                                        - Ajout de la fonctionnalité de gestion des périodes<br/>
                                    </p>
                                </styled.UpdateItem>
                                <styled.UpdateItem>
                                    <h3>Mise à jour du 02/08/2023</h3>
                                    <p>
                                        - Ajout de la fonctionnalité de gestion des groupes<br/>
                                        - Ajout de la fonctionnalité de gestion des agents<br/>
                                        - Ajout de la fonctionnalité de gestion des trains<br/>
                                        - Ajout de la fonctionnalité de gestion des renforts<br/>
                                        - Ajout de la fonctionnalité de gestion des périodes<br/>
                                    </p>
                                </styled.UpdateItem>
                            </styled.News>
                        </styled.Side>
                        <styled.Side>
                            <styled.Row>
                                <StatsBox
                                    iconColor="#eddfdf"
                                    borderColor="#b97070"
                                    icon={IoMdTrain}
                                    label="Renforts"
                                    count={statistics.agentCount}
                                />
                                <StatsBox
                                    iconColor="#ede7f6"
                                    borderColor="#8672a5"
                                    icon={IoMdTrain}
                                    label="Trains"
                                    count={statistics.trainCount}
                                />
                            </styled.Row>
                            <styled.GraphicBox>
                                <styled.HeaderGraphicBox>
                                    <h2>Agents</h2>
                                </styled.HeaderGraphicBox>
                                <BarChart chartData={createDataset(statistics.usersData, "Renforts")} />
                            </styled.GraphicBox>
                        </styled.Side>
                    </styled.BodyStatContainer>
                </styled.Content>
            </div>
        </Container>
    );
};

export default Dashboard;
