import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Container from '../../components/container/Container';
import {HeaderGroupContainer, HeaderTitle} from "../../style/groupsStyles";

import { Button } from "antd";

import { IoMdTrain } from 'react-icons/io';
import { HiUserGroup } from 'react-icons/hi';
import { HiMenuAlt3 } from 'react-icons/hi'
import BarChart from "../../components/Charts/TabChart";
import LineChart from "../../components/Charts/LineChart";
import axios from "axios";

const Home = () => {
    const [groupsData, setGroupsData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        const getGroupCountsForNext5Days = () => {
            axios.get(`${process.env.REACT_APP_API_HOST}/group/list/counts`).then((res) => {
                setGroupsData(res.data);
            }).catch((err) => console.error(err));
        }

        const getUserCountsForNext5Days = () => {
            axios.get(`${process.env.REACT_APP_API_HOST}/user/list/counts`).then((res) => {
                setUsersData(res.data);
            }).catch((err) => console.error(err));
        }

        getGroupCountsForNext5Days();
        getUserCountsForNext5Days();
    }, [])

    let dataGroups = {
        labels: groupsData?.map((data) => data.date),
        datasets: [
            {
                label: "Groupes",
                data: groupsData?.map((data) => data.count),
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                tension: 0.3
            }
        ],
    };

    let dataUsers = {
        labels: usersData?.map((data) => data.date),
        datasets: [
            {
                label: "Agents",
                data: usersData?.map((data) => data.count),
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                tension: 0.3
            }
        ],
    };

    return (
        <Container title={'Tableau de bord'}>
            <BodyStatContainer>
                <Side>
                    <Box>
                        <div>
                            <h3>
                                120
                            </h3>
                            <p>
                                Groupes pris en charge
                            </p>
                        </div>
                        <div>
                            <WrapperIcon color={'#151d3f'}>
                                <IoMdTrain size={38} color={'#fff'} />
                            </WrapperIcon>
                        </div>
                    </Box>
                    <Box>
                        <div>
                            <h3>
                                120
                            </h3>
                            <p>
                                Groupes pris en charge
                            </p>
                        </div>
                        <div>
                            <WrapperIcon color={'#151d3f'}>
                                <IoMdTrain size={38} color={'#fff'} />
                            </WrapperIcon>
                        </div>
                    </Box>
                    <Box>
                        <div>
                            <h3>
                                120
                            </h3>
                            <p>
                                Groupes pris en charge
                            </p>
                        </div>
                        <div>
                            <WrapperIcon color={'#151d3f'}>
                                <IoMdTrain size={38} color={'#fff'} />
                            </WrapperIcon>
                        </div>
                    </Box>
                    <Box>
                        <div>
                            <h3>
                                120
                            </h3>
                            <p>
                                Groupes pris en charge
                            </p>
                        </div>
                        <div>
                            <WrapperIcon color={'#151d3f'}>
                                <IoMdTrain size={38} color={'#fff'} />
                            </WrapperIcon>
                        </div>
                    </Box>
                </Side>
                <Side>
                    <GraphicBox>
                        <HeaderGraphicBox>
                            <h2>Groupes</h2>
                        </HeaderGraphicBox>
                        <BarChart chartData={dataGroups} />
                    </GraphicBox>
                    <GraphicBox>
                        <HeaderGraphicBox>
                            <h2>Agents</h2>
                        </HeaderGraphicBox>
                        <BarChart chartData={dataUsers} />
                    </GraphicBox>
                </Side>
            </BodyStatContainer>
            {/* <BodyStatContainer>
                <LeftContainer>
                    <StatsWrapper width={'100%'}>
                        <HeaderStatsWrapper>
                            <ColoredSpan />
                            <StatsTitle>
                                Vision globale
                            </StatsTitle>
                        </HeaderStatsWrapper>
                        <GlobalStats>
                            <ChildStats>
                                <div>
                                    <WrapperIcon color={'#FFB7B7'}>
                                        <IoMdTrain size={27} color={'#fff'} />
                                    </WrapperIcon>
                                </div>
                                <div>
                                    <Category>Trains</Category>
                                    <CategoryNumber>0</CategoryNumber>
                                </div>
                            </ChildStats>
                            <VerticalSeparator />
                            <ChildStats>
                                <div>
                                    <WrapperIcon color={'#B7E0FF'}>
                                        <HiUserGroup size={27} color={'#fff'} />
                                    </WrapperIcon>
                                </div>
                                <div>
                                    <Category>Groupes</Category>
                                    <CategoryNumber>0</CategoryNumber>
                                </div>
                            </ChildStats>
                            <VerticalSeparator />
                            <ChildStats>
                                <div>
                                    <WrapperIcon color={'#CAE3BE'}>
                                        <HiUserGroup size={27} color={'#fff'} />
                                    </WrapperIcon>
                                </div>
                                <div>
                                    <Category>Agents</Category>
                                    <CategoryNumber>0</CategoryNumber>
                                </div>
                            </ChildStats>
                            <VerticalSeparator />
                            <ChildStats>
                                <div>
                                    <WrapperIcon color={'#DCBEE3'}>
                                        <HiUserGroup size={27} color={'#fff'} />
                                    </WrapperIcon>
                                </div>
                                <div>
                                    <Category>Programmations</Category>
                                    <CategoryNumber>0</CategoryNumber>
                                </div>
                            </ChildStats>
                            <VerticalSeparator />
                            <ChildStats>
                                <div>
                                    <WrapperIcon color={'#FFEEB7'}>
                                        <HiUserGroup size={27} color={'#fff'} />
                                    </WrapperIcon>
                                </div>
                                <div>
                                    <Category>Utilisateurs</Category>
                                    <CategoryNumber>0</CategoryNumber>
                                </div>
                            </ChildStats>
                        </GlobalStats>
                    </StatsWrapper>
                    <StatsWrapper width={'100%'}>
                        <HeaderStatsWrapper>
                            <ColoredSpan />
                            <StatsTitle>
                                Graphique des groupes
                            </StatsTitle>
                        </HeaderStatsWrapper>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <div style={{ width: '40%', height: '250px' }}>
                                <BarChart chartData={dataGroups} />
                            </div>
                            <div style={{ width: '40%', height: '250px' }}>
                                <BarChart chartData={dataUsers} />
                            </div>
                        </div>
                    </StatsWrapper>
                    <StatsWrapper width={'100%'}>
                        <HeaderStatsWrapper>
                            <ColoredSpan />
                            <StatsTitle>
                                Dernières mises à jour
                            </StatsTitle>
                        </HeaderStatsWrapper>
                        <div>
                            <ContainerDateItem>
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <ReportsDate>Jeudi 19 Janvier</ReportsDate>
                                        <ReleaseTag>Mise à jour</ReleaseTag>
                                    </div>
                                    <ReportsTitle>Exemple de nouvelle mise à jour</ReportsTitle>
                                    <ReportsUser>Axel GIL-DEMOREST</ReportsUser>
                                </div>
                                <Button>Lire plus</Button>
                            </ContainerDateItem>
                            <ContainerDateItem>
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <ReportsDate>Jeudi 19 Janvier</ReportsDate>
                                        <ReleaseTag>Mise à jour</ReleaseTag>
                                    </div>
                                    <ReportsTitle>Exemple de nouvelle mise à jour</ReportsTitle>
                                    <ReportsUser>Axel GIL-DEMOREST</ReportsUser>
                                </div>
                                <Button>Lire plus</Button>
                            </ContainerDateItem>
                            <ContainerDateItem>
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <ReportsDate>Jeudi 19 Janvier</ReportsDate>
                                        <ReleaseTag>Mise à jour</ReleaseTag>
                                    </div>
                                    <ReportsTitle>Exemple de nouvelle mise à jour</ReportsTitle>
                                    <ReportsUser>Axel GIL-DEMOREST</ReportsUser>
                                </div>
                                <Button>Lire plus</Button>
                            </ContainerDateItem>
                        </div>
                    </StatsWrapper>
                </LeftContainer>
                <RightContainer>
                    {/*<StatsWrapper width={'100%'}>
                        <HeaderStatsWrapper>
                            <ColoredSpan />
                            <StatsTitle>
                                Prochains jours
                            </StatsTitle>
                        </HeaderStatsWrapper>
                        <div>
                            <ContainerDateItem>
                                <div>
                                    <DateListItem>Jeudi 19 Janvier</DateListItem>
                                    <NumberGroupItem>20 groupes | 10 renforts assignés à cette journée</NumberGroupItem>
                                </div>
                                <Button>Accéder aux programmations</Button>
                            </ContainerDateItem>
                            <ContainerDateItem>
                                <div>
                                    <DateListItem>Vendredi 20 Janvier</DateListItem>
                                    <NumberGroupItem>20 groupes | 2 renforts assignés à cette journée</NumberGroupItem>
                                </div>
                                <Button>Accéder aux programmations</Button>
                            </ContainerDateItem>
                            <ContainerDateItem>
                                <div>
                                    <DateListItem>Samedi 21 Janvier</DateListItem>
                                    <NumberGroupItem>20 groupes | 8 renforts assignés à cette journée</NumberGroupItem>
                                </div>
                                <Button>Accéder aux programmations</Button>
                            </ContainerDateItem>
                            <ContainerDateItem>
                                <div>
                                    <DateListItem>Dimanche 22 Janvier</DateListItem>
                                    <NumberGroupItem>20 groupes | 2 renforts assignés à cette journée</NumberGroupItem>
                                </div>
                                <Button>Accéder aux programmations</Button>
                            </ContainerDateItem>
                            <ContainerDateItem>
                                <div>
                                    <DateListItem>Lundi 23 Janvier</DateListItem>
                                    <NumberGroupItem>20 groupes | 5 renforts assignés à cette journée</NumberGroupItem>
                                </div>
                                <Button>Accéder aux programmations</Button>
                            </ContainerDateItem>
                        </div>
                    </StatsWrapper>
                </RightContainer>
            </BodyStatContainer> */}
        </Container>
    );
};

const Header = styled.div`
  height: 100px;
  background-color: #fff;
  border-bottom: 1.5px solid #eaeaea;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 70px;
  
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const Title = styled.h1`
  margin: 0 0 0 15px;
  font-weight: bold;
  font-size: 30px;
`;

const BodyStatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  width: 100%;
  padding-top: 40px;
`;

const Side = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-bottom: 40px;
`;

const Box = styled.div`
  height: 200px;
  width: 20%;
  background-color: #fff;
  border: 1.5px solid #eaeaea;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 30px;
  
  h3 {
    font-size: 30px;
    font-weight: bold;
    margin: 0;
  }
  
  p {
    font-size: 20px;
  }
`;

const GraphicBox = styled.div`
  width: 44%;
  background-color: #fff;
  border: 1.5px solid #eaeaea;
  border-radius: 10px;
  display: flex;
  padding: 30px 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HeaderGraphicBox = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 99%;
  margin-bottom: 5px;
  
  h2 {
    font-size: 25px;
    font-weight: bold;
  }
`;

const LeftContainer = styled.div`
  width: 60%; 
  margin-right: 10px;
  @media (max-width: 2560px) {
    width: 100%;
  }
`;

const RightContainer = styled.div`
  width: 30%;
  @media (max-width: 2560px) {
    width: 100%;
  }
`;

const StatsWrapper = styled.div`
  padding: 20px 35px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  height: auto;
  width: ${({width}) => width};
  margin-bottom: 10px;
`;

const HeaderStatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  margin-bottom: 30px;
`;

const StatsTitle = styled.h2`
  font-weight: 700;
  margin: 0;
`;

const ColoredSpan = styled.div`
  width: 15px;
  background-color: #ffa1a1;
  height: 30px;
  border-radius: 5px;
  margin-right: 15px;
`;

const GlobalStats = styled.div`
  background-color: #fff;
  padding: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ChildStats = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  padding: 15px 20px;
  height: auto;
  &:hover {
    background-color: #fff;
    transition: 200ms;
  }
`;

const VerticalSeparator = styled.div`
  height: 50px;
  width: 1px;
  background-color: lightgray;
`;

const Category = styled.p`
  font-weight: bold;
  color: #767676;
  margin: 0;
  font-size: 15px;
`;

const CategoryNumber = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 0;
  padding: 0;
`;

const WrapperIcon = styled.div`
  height: 70px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-right: 20px;
  background-color: ${({color}) => color};
`;

const ContainerDateItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DateListItem = styled.p`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 5px;
`;

const NumberGroupItem = styled.p`
  font-size: 16px;
`;

const ReportsDate = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #a0a0a0;
  margin-right: 15px;
`;

const ReportsTitle = styled.p`
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 8px;
`;

const ReportsUser = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #6a6a6a;
`;

const ReportsTag = styled.p`
  background-color: #F3F6FF;
  color: #5c62d9;
  font-weight: 700;
  padding: 2px 20px;
  border-radius: 13px;
`;

const ReleaseTag = styled.p`
  background-color: #fff3f3;
  color: #d95c5c;
  font-weight: 700;
  padding: 2px 20px;
  border-radius: 13px;
`;

export default Home;
