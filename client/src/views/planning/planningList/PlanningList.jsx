import React, {useCallback, useEffect, useMemo, useState} from 'react';

import Container from "../../../components/container/Container";
import * as styled from "./PlanningList.styled";
import PlanningItem from "./components/PlanningItem/PlanningItem";
import axios from "axios";
import moment from "moment/moment";
import 'moment/locale/fr';
import {Collapse, DatePicker} from "antd";

const PlanningList = () => {
    const [groupedPlanning, setGroupedPlanning] = useState({});

    const groupByMonth = (planningList) => {
        let groupedByMonth = {};

        for (let item of planningList) {
            let dateParts = item.planning_day.split('/');
            let monthYear = dateParts[1] + '-' + dateParts[2];

            if (!groupedByMonth[monthYear]) {
                groupedByMonth[monthYear] = [];
            }

            groupedByMonth[monthYear].push(item);
        }

        return groupedByMonth;
    };

    const getPlannings = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_HOST}/api/planning`).then((res) => {
            setGroupedPlanning(groupByMonth(res.data));
        }).catch((err) => console.error(err));
    }, []);

    const mapPlanning = useMemo(() => {
        return Object.keys(groupedPlanning).map((month, index) => {
            return {
                key: index,
                label: `${moment(month, 'MM').format('MMMM')} ${month.split('-')[1]}`,
                children: (
                    <styled.PlanningList style={{ width: '100%' }}>
                        {groupedPlanning[month].map((item, index) => (
                            <PlanningItem item={item} key={index} getPlannings={getPlannings} />
                        ))}
                    </styled.PlanningList>
                )
            };
        });
    }, [groupedPlanning, getPlannings]);

    useEffect(() => {
        getPlannings();
    }, [getPlannings]);

    return (
        <Container title={'Suivi des programmations des agents'}>
            <styled.ListContainer>
                <styled.Header>
                    <DatePicker
                        onChange={(date, dateString) => {
                            const selectedDate = new Date(dateString).toLocaleDateString(
                                'fr-FR',
                                { year: 'numeric', month: '2-digit', day: '2-digit' }
                            )

                            if (dateString.length > 0) {
                                axios.get(`${import.meta.env.VITE_API_HOST}/api/planning/day/${selectedDate.replace(new RegExp('/', 'g'), '-')}/all`).then((res) => {
                                    setGroupedPlanning(groupByMonth(res.data));
                                }).catch((err) => console.error(err));
                            } else {
                                getPlannings();
                            }

                        }}
                        style={{ width: 300 }}
                    />
                </styled.Header>
                <Collapse
                    items={mapPlanning}
                    defaultActiveKey={['0']}
                />
            </styled.ListContainer>
        </Container>
    );
};

export default PlanningList;
