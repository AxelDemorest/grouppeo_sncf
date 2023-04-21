import React, {useEffect, useState} from 'react';
import Container from "../../../components/container/Container";
import {HeaderGroupContainer, HeaderTitle} from "../../../style/groupsStyles";
import styled from "styled-components";
import {Button, DatePicker, Table} from "antd";
import axios from "axios";
import GroupInformation from "./components/GroupInformation/GroupInformation";

const PlanningView = () => {
    const [datePicker, setDatePicker] = useState('');
    const [planning, setPlanning] = useState([]);

    useEffect(() => {
        const getPlanning = () => {
            axios.get(`${process.env.REACT_APP_API_HOST}/planning/day/12-02-2023/user/6`).then((res) => {
                setPlanning(res.data.planning_groups);
            }).catch((err) => console.error(err));
        }

        getPlanning();
    }, [datePicker]);

    const planningColumns = [
        {
            title: "Actions",
            key: "group_actions",
            width: 200,
        },
        {
            title: "Heure de départ",
            dataIndex: ['group_train', 'train_hour'],
            key: "train_hour",
        },
        {
            title: "Numéro du train",
            dataIndex: ['group_train', 'train_number'],
            key: "train_number",
        },
        {
            title: "Voie",
            dataIndex: ['group_train', 'train_track'],
            key: "train_track",
            render: (text) => text ? text : 'Pas renseignée'
        },
        {
            title: "Destination",
            dataIndex: "group_destination",
            key: "group_destination",
        },
        { title: "Nom groupe", dataIndex: "group_name", key: "group_name" },
        {
            title: "Total voyageurs",
            dataIndex: "group_total_travellers",
            key: "group_total_travellers",
        },
        {
            title: "N° Voiture",
            dataIndex: "group_car_number",
            key: "group_car_number",
        },
        { title: "Nature groupe", dataIndex: "group_type", key: "group_type" },
        {
            title: "Prestation",
            dataIndex: "group_prestation",
            key: "group_prestation",
            render: (text) => text ? 'BAGTM' : 'NON'
        },
        {
            title: "Point RV",
            dataIndex: "group_meeting_point",
            key: "group_meeting_point",
        },
        {
            title: "Heure RV",
            dataIndex: "group_meeting_time",
            key: "group_meeting_time",
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.group_meeting_time?.replace('H', '') - b.group_meeting_time?.replace('H', ''),
        },
        {
            title: "Responsable JDD",
            dataIndex: "group_responsable_departure_day",
            key: "group_responsable_departure_day",
        },
        {
            title: "Tel. responsable JDD",
            dataIndex: "group_responsable_phone_departure_day",
            key: "group_responsable_phone_departure_day",
        },
    ];


    const onChange = (date, dateString) => {
        const formatDate = new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
        console.log(formatDate)
        setDatePicker(formatDate);
    };


    return (
        <Container>
            <HeaderGroupContainer>
                <HeaderTitle>Vos programmations</HeaderTitle>
                <p>
                    Cette page liste toutes vos programmations en tant que renfort groupe dans les prochaines journées.
                </p>
            </HeaderGroupContainer>
            <PlanningContainer>
                <div>
                    <CustomDatePicker
                        defaultValue={datePicker}
                        onChange={onChange}
                    />
                    <DownloadButton>
                        Télécharger
                    </DownloadButton>
                </div>
                <CustomTable
                    bordered
                    scroll={{ x: 1000 }}
                    pagination={{ defaultPageSize: 18 }}
                    columns={planningColumns}
                    dataSource={planning?.map((obj) => ({
                        key: obj.group_id,
                        ...obj,
                    }))}
                    style={{ marginTop: '20px' }}
                />
            </PlanningContainer>
            <ResponsiveList>
                <>
                    {planning?.map((obj) => (
                        <GroupInformation obj={obj} key={obj.group_id} />
                    ))}
                </>
            </ResponsiveList>
        </Container>
    );
};

const PlanningContainer = styled.div`
  width: auto;
  height: auto;
  margin: 25px 40px 40px 40px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
`;

const CustomDatePicker = styled(DatePicker)`
  width: 10%;
  margin-bottom: 10px;
  margin-right: 30px;
  
  @media only screen and (max-width: 767px) {
    width: 80%;
  }
`;

const DownloadButton = styled(Button)`
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;

const CustomTable = styled(Table)`
  display: block;
  
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;

const ResponsiveList = styled.div`
    display: none;
    
    @media only screen and (max-width: 767px) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

export default PlanningView;
