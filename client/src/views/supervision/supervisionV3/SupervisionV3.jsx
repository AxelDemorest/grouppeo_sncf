import React, {useEffect, useState} from 'react';
import * as styled from "./SupervisionV3.styled";
import Container from "../../../components/container/Container";
import Table from "../../../components/table/Table";
import axios from "axios";
import {handleApiError} from "../../../api/errors/apiErrorHandler";
import {Button, Input, message, Modal, Tag} from "antd";
import { GrFormCheckmark } from 'react-icons/gr';
import { BiPlus } from 'react-icons/bi';
import { FiEdit, FiRadio } from 'react-icons/fi';

const statuses = [
    { id: 1, title: 'Groupe arrivé' },
    { id: 3, title: 'Groupe installé' },
    { id: 4, title: 'TM débutée' },
    { id: 5, title: 'TM terminée' },
];

function renderStatuses(status, currentStatus, currentGroup, onClick) {
    const findItem = currentStatus?.find((findStatus) => findStatus?.status?.name === status.title);

    if (findItem) {
        return (
            <styled.Steps>
                <styled.Step style={{ backgroundColor: '#e3f6e5', border: '1px solid #00AF55' }}>
                    <div className="round-div">
                        <GrFormCheckmark />
                    </div>
                    <styled.StepTitle style={{ marginRight: '0' }}>{status.title}</styled.StepTitle>
                </styled.Step>
            </styled.Steps>
        )
    } else {
        return (
            <styled.Steps>
                <styled.Step onClick={() => onClick(currentGroup.group_id, status.id)}>
                    <div className="round-div-processing">
                        <BiPlus />
                    </div>
                    <p>Valider</p>
                </styled.Step>
            </styled.Steps>
        )
    }
}

const SupervisionV3 = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = React.useState([]);
    const [radiosRenforts, setRadiosRenforts] = React.useState([]);
    const [meetingPoints, setMeetingPoints] = React.useState([]);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [trackValue, setTrackValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (train) => {
        setSelectedTrain(train);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        if (trackValue.trim() === '') {
            return;
        }

        let updatedRecord = {
            train_track: trackValue
        };

        axios.patch(`${import.meta.env.VITE_API_HOST}/api/train/${selectedTrain.train_id}`, updatedRecord)
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Voie modifiée avec succès',
                });
            }).catch(err => {
            console.error(err)
        });

        setData(data.map((train) => {
            if (train.train_id === selectedTrain.train_id) {
                train.train_track = trackValue;
            }
            return train;
        }));
        setSelectedTrain(null);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const date = new Date().toLocaleDateString(
            'fr-FR',
            { year: 'numeric', month: '2-digit', day: '2-digit' }
        );

        const fetchTrainData = async () => {
            try {
                const response = await axios.get('/api/train/day', {
                    params: { day: '08/07/2023' },
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                return response.data;
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchRadioData = async () => {
            try {
                const response = await axios.get('/api/radios/type/agent', {
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                return response.data;
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchMeetingPointData = async () => {
            try {
                const response = await axios.get('/api/meeting-point/', {
                    baseURL: import.meta.env.VITE_API_HOST,
                });
                return response.data;
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchData = async () => {
            const [trainData, radioData, meetingPointData] = await Promise.all([fetchTrainData(), fetchRadioData(), fetchMeetingPointData()]);

            trainData.forEach(train => {
                train.train_groups.forEach(group => {
                    group.radioInfo = radioData.find(radio => radio.agentNumber === group?.group_planning?.agentNumber);
                });
            });

            setMeetingPoints(meetingPointData);
            setRadiosRenforts(radioData);
            setData(trainData);
        };

        fetchData();
    }, []);

    const onClick = async ( currentGroupId, statusId ) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_HOST}/api/group-status/${currentGroupId}/statuses/${statusId}`);
            const newStatus = { status: { name: statuses.find((s) => s.id === statusId).title } };
            setData((prevData) =>
                prevData.map((train) => ({
                    ...train,
                    train_groups: train.train_groups.map((group) =>
                        group.group_id === currentGroupId
                            ? {
                                ...group,
                                groupStatus: [...group.groupStatus, newStatus],
                            }
                            : group
                    ),
                }))
            );
        } catch (error) {
            handleApiError(error);
        }
    }

    const columns = [
        {
            name: 'Groupe arrivé',
            render: (item) => (
                <>
                    {renderStatuses(statuses[0], item?.groupStatus, item, onClick)}
                </>
            ),
        },
        {
            name: 'Groupe installé',
            render: (item) => (
                <>
                    {renderStatuses(statuses[1], item?.groupStatus, item, onClick)}
                </>
            ),
        },
        {
            name: 'TM débutée',
            render: (item) => (
                <>
                    {renderStatuses(statuses[2], item?.groupStatus, item, onClick)}
                </>
            ),
        },
        {
            name: 'TM terminée',
            render: (item) => (
                <>
                    {renderStatuses(statuses[3], item?.groupStatus, item, onClick)}
                </>
            ),
        },
        {
            name: 'Renfort',
            render: (item) => <Tag color="geekblue">Renfort {item?.group_planning?.agentNumber || ''} - {item?.radioInfo?.number || ''} </Tag>,
        },
        {
            name: 'Heure RDV',
            render: (item) => item.group_meeting_time,
        },
        {
            name: 'Point de RDV',
            render: (item) => item.group_name,
        },
        {
            name: 'Destination du groupe',
            render: (item) => item.group_destination,
        },
        {
            name: 'Nom du groupe',
            render: (item) => item.group_name,
        },
        {
            name: 'Total voyageurs',
            render: (item) => item.group_total_travellers,
        },
        {
            name: 'N° Voiture(s)',
            render: (item) => item.group_car_number,
        },
        {
            name: 'Prestation',
            render: (item) => item.group_prestation ? <Tag color="processing">BAGTM</Tag> : '',
        },
        {
            name: 'Nature du groupe',
            render: (item) => item.group_type,
        },
        {
            name: 'Responsable JDD',
            render: (item) => item.group_responsable_departure_day,
        },
        {
            name: 'Tél. Responsable JDD',
            render: (item) => item.group_responsable_phone_departure_day,
        },
    ];

    const radioDPX = [
        {
            name: 'DEIDDA',
            radio: '599586'
        },
        {
            name: 'FOUET',
            radio: '598266'
        },
        {
            name: 'LHERBIER',
            radio: '598528'
        },
        {
            name: 'LENEVEU',
            radio: '598271'
        },
        {
            name: 'OTOVIC',
            radio: '598009'
        },
        {
            name: 'BEY BELMEHEL',
            radio: '599554'
        },
        {
            name: 'FARASSI',
            radio: '113734'
        },
        {
            name: 'MESSA OSPINA',
            radio: '113723'
        },
        {
            name: 'MARCHAL',
            radio: '113713'
        },
    ]

    return (
        <>
            {contextHolder}
            <Container title={'supervision des groupes'}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '80%' }}>
                        {data.map((train, index) => (
                            <styled.Train key={index}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <h3>Train n°{train.train_number} • {train.train_hour} • Voie {train.train_track}</h3>
                                    <button onClick={() => showModal(train)}><FiEdit /></button>
                                </div>
                                <Table columns={columns} data={train.train_groups} />
                            </styled.Train>
                        ))}
                    </div>
                    <styled.RadioContainer>
                        <styled.Radio>
                            <h3>Radios - DPX</h3>
                            <styled.RadioList>
                                <>
                                    {radioDPX.map((item, index) => (
                                        <styled.RadioItem key={index}>
                                            <styled.CircleIcon>
                                                <FiRadio size={25} />
                                            </styled.CircleIcon>
                                            <div>
                                                <styled.Label>{item.name}</styled.Label>
                                                <styled.GroupValue>{item.radio}</styled.GroupValue>
                                            </div>
                                        </styled.RadioItem>
                                    ))}
                                </>
                            </styled.RadioList>
                        </styled.Radio>
                        <styled.Radio>
                            <h3>Radios - Renforts</h3>
                            <styled.RadioList>
                                <>
                                    {radiosRenforts.map((radio, index) => (
                                        <styled.RadioItem key={index}>
                                            <styled.CircleIcon>
                                                <FiRadio size={25} />
                                            </styled.CircleIcon>
                                            <div>
                                                <styled.Label>RENFORT {radio.agentNumber}</styled.Label>
                                                <styled.GroupValue>{radio.number}</styled.GroupValue>
                                            </div>
                                        </styled.RadioItem>
                                    ))}
                                </>
                            </styled.RadioList>
                        </styled.Radio>
                        <styled.Radio>
                            <h3>Radios - Points</h3>
                            <styled.RadioList>
                                <>
                                    {meetingPoints.map((point, index) => (
                                        <styled.RadioItem key={index}>
                                            <styled.CircleIcon>
                                                <FiRadio size={25} />
                                            </styled.CircleIcon>
                                            <div>
                                                <styled.Label>POINT {point.name}</styled.Label>
                                                <styled.GroupValue>{point?.radio?.number || 'Aucune radios'}</styled.GroupValue>
                                            </div>
                                        </styled.RadioItem>
                                    ))}
                                </>
                            </styled.RadioList>
                        </styled.Radio>
                    </styled.RadioContainer>
                </div>
            </Container>
            <Modal title="Modifier la voie" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: trackValue.trim() === '' }}>
                <Input value={trackValue} onChange={(e) => setTrackValue(e.target.value)} placeholder="Indiquez la nouvelle voie" />
            </Modal>
        </>
    );
};

export default SupervisionV3;
