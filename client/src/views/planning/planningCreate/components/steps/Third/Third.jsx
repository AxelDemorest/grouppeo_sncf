import React, {useEffect, useState} from 'react';
import {Button, Input, message, Table} from "antd";
import axios from "axios";

import SideModal from "../../../../../../components/SideModal/SideModal";
import * as styled from "../../../PlanningCreate.styled";

const EditableCell = ({ text, record, messageApi }) => {
    const [value, setValue] = useState(text);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        let updatedRecord = { ...record };
        updatedRecord.group_meeting_point = value;
        delete updatedRecord.key;

        axios.patch(`${import.meta.env.VITE_API_HOST}/api/group/${record.group_id}`, updatedRecord)
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Point modifié avec succès',
                });
            }).catch(err => {
            console.error(err)
        });
        console.log(`Call API with value: ${value}`);
    };

    return <Input value={value} onChange={handleChange} onBlur={handleBlur} />;
};

const Third = ({ title, onFinish, day }) => {
    const [data, setData] = useState([]);
    const [currentGroup, setCurrentGroup] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const [isShowModal, setIsShowModal] = useState(false);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_HOST}/api/group/without-meeting-point/${day}`)
        .then(response => {
            setData(response.data);
        }).catch(err => {
            console.error(err)
        });
    }, []);

    const handleClose = () => {
        setIsShowModal(false);
    };

    const onClick = (e) => {
        onFinish()
    };

    const columns = [
        {
            title: 'actions',
            key: 'actions',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            setCurrentGroup(record);
                            setIsShowModal(true);
                        }}
                    >
                        Voir tout
                    </Button>
                </div>
            ),
        },
        {
            title: 'train_date',
            dataIndex: ['group_train', 'train_date'],
            key: 'train_date',
        },
        {
            title: 'train_number',
            dataIndex: ['group_train', 'train_number'],
            key: 'train_number',
        },
        {
            title: 'group_name',
            dataIndex: 'group_name',
            key: 'group_name',
        },
        {
            title: 'group_meeting_point',
            dataIndex: 'group_meeting_point',
            key: 'group_meeting_point',
            width: 650,
            render: (text, record) => <EditableCell text={text} record={record} messageApi={messageApi}/>,
        },
    ];

    const labels = {
        'group_id': 'Identifiant',
        'group_name': 'Nom du groupe',
        'group_type': 'Type',
        'group_total_travellers': 'Nombre Pax',
        'group_destination': 'Destination',
        'group_car_number': 'Numéro de voiture',
        'group_meeting_time': 'Heure de RDV',
        'group_meeting_point': 'Point de RDV',
        'group_prestation': 'Traction',
        'group_responsable_departure_day': 'Responsable - jour du départ',
        'group_responsable_phone_departure_day': 'Téléphone responsable - jour du départ',
        'group_mail': 'Mail',
        'group_train': 'Informations liées au train',
        'train_id': 'Identifiant du train',
        'train_number': 'Numéro du train',
        'train_date': 'Jour de circulation',
        'train_hour': 'Heure de départ',
        'train_track': 'Voie de départ',
    };

    const unauthorizedValues = ['group_reservation_state', 'group_is_supported'];

    return (
        <>
            {contextHolder}
            <styled.GenerateContainer>
                <styled.Header>
                    <styled.GenerateTitle>{title}</styled.GenerateTitle>
                </styled.Header>
                <div>
                    <styled.ShortDescription padding={'30px 30px 0 20px'}>{data.length} groupes ont été trouvés sans point de RDV correct. Appliquez des modifications s'il le faut ou continuez.</styled.ShortDescription>
                    <Table
                        columns={columns}
                        dataSource={data.map((item, index) => ({
                            key: index,
                            ...item,
                        }))}
                    />
                    <styled.CustomButton onClick={onClick}>
                        Continuer
                    </styled.CustomButton>
                </div>
            </styled.GenerateContainer>
            <SideModal isShowing={isShowModal} onClose={handleClose}>
                <h2>Groupe - {currentGroup.group_name}</h2>
                <div style={{ marginTop: '30px' }}>
                    {Object.entries(currentGroup).map(([key, value]) => {
                        if (key !== 'key' && !unauthorizedValues.includes(key)) {
                            return (
                                <div key={key}>
                                    <styled.Label>{labels[key] || key}:</styled.Label>
                                    {
                                        typeof value === 'object' && value !== null
                                            ? Object.entries(value).map(([innerKey, innerValue]) => (
                                                <div key={innerKey}>
                                                    <styled.Label>{labels[innerKey] || innerKey}:</styled.Label>
                                                    <styled.GroupValue>{innerValue !== null ? innerValue : 'Aucune information'}</styled.GroupValue>
                                                </div>
                                            ))
                                            : <styled.GroupValue>{value ? value : 'Aucune information'}</styled.GroupValue>
                                    }
                                </div>
                            )
                        }
                    })}
                </div>
            </SideModal>
        </>
    );
};

export default Third;
