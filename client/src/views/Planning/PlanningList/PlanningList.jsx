import React, {useCallback, useEffect, useState} from 'react';

import Container from "../../../components/container/Container";
import {HeaderGroupContainer, HeaderTitle} from "../../../style/groupsStyles";
import * as styled from "./PlanningList.styled";
import PlanningItem from "./components/PlanningItem/PlanningItem";
import axios from "axios";

const PlanningList = () => {
    const [planningList, setPlanningList] = useState([]);

    const onChange = useCallback(() => {
    }, []);

    useEffect(() => {
        const getPlannings = () => {
            axios.get(`${process.env.REACT_APP_API_HOST}/planning`).then((res) => {
                setPlanningList(res.data);
            }).catch((err) => console.error(err));
        }

        getPlannings();
    }, []);

    return (
        <Container title={'Suivi des programmations des agents'}>
            <styled.PlanningContainer>
                <styled.CustomSelect
                    placeholder={'Choisissez une période'}
                    onChange={onChange}
                />
            </styled.PlanningContainer>
            <styled.ListContainer>
                <>
                    {planningList.map((item, index) => (
                        <PlanningItem item={item} key={index} />
                    ))}
                </>
            </styled.ListContainer>
        </Container>
    );
};

export default PlanningList;
