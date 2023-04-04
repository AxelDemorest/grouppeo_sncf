import React from 'react';
import * as styled from "./Settings.styled";
import { Tabs } from "antd";

import { HeaderGroupContainer, HeaderTitle } from "../../style/groupsStyles";

import Container from "../../components/container/Container";
import Radio from "./components/Radios/Radio";
import MeetingPoint from "./components/MeetingPoint/MeetingPoint";
import Period from "./components/Period/Period";

const Settings = () => {

    const items = [
        {
            key: '1',
            label: `Général`,
            children: `Aucun paramètre disponible pour le moment.`
        },
        {
            key: '2',
            label: `Radios`,
            children: (
                <Radio />
            )
        },
        {
            key: '3',
            label: `Points de rendez-vous`,
            children: (
                <MeetingPoint />
            )
        },
        {
            key: '4',
            label: `Périodes`,
            children: (
                <Period />
            )
        },
    ];

    return (
        <Container>
            <HeaderGroupContainer>
                <HeaderTitle>Réglages</HeaderTitle>
                <p>
                    Modifiez les paramètres du site en ayant accès à différents onglets.
                </p>
            </HeaderGroupContainer>
            <styled.ListTabs>
                <Tabs defaultActiveKey="1" items={items} />
            </styled.ListTabs>
        </Container>
    );
};

export default Settings;