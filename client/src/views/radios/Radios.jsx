import React, {useEffect, useState} from 'react';
import * as styled from "./Radios.styled";
import Container from "../../components/container/Container";
import {Button, Form, Input, Modal, Table} from "antd";
import {fetchRadios} from "../../api/services/radioServices";
import {fetchMeetingPoints} from "../../api/services/meetingPointServices";
import axios from "axios";
import RadioForm from "./components/RadioForm";
import {fetchUsersByType} from "../../api/services/userServices";
import RadioFormDPX from "./components/RadioFormDPX";

const Radios = () => {
    const [meetingPoints, setMeetingPoints] = useState([]);
    const [radios, setRadios] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDPX, setOpenDPX] = useState(false);
    const [users, setUsers] = useState([]);
    const [form] = Form.useForm();
    const [formDPX] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            const [radios, meetingPoints, users] = await Promise.all([fetchRadios(), fetchMeetingPoints(), fetchUsersByType()]);
            setRadios(radios);
            setMeetingPoints(meetingPoints);
            setUsers(users);
        }

        fetchData();
    }, []);

    const handleOk = () => {
        form.submit();
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const handleOkDPX = () => {
        formDPX.submit();
        setOpenDPX(false);
    };
    const handleCancelDPX = () => {
        setOpenDPX(false);
    };

    const DPXcolumns = [
        {
            title: "Numéro de la radio",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "Nom du DPX",
            dataIndex: "dpx",
            key: "dpx",
        },
    ];

    const Pointcolumns = [
        {
            title: "Numéro de la radio",
            dataIndex: "name",
            key: "number",
            align: 'center',
        },
        {
            title: "Numéro du point",
            dataIndex: ['radio', 'number'],
            key: "mpName",
            align: 'center',
        },
    ];

    const Agentcolumns = [
        {
            title: "Numéro de la radio",
            dataIndex: "number",
            key: "number",
            align: 'center',
        },
        {
            title: "Numéro du renfort",
            dataIndex: "agentNumber",
            key: "agentNumber",
            align: 'center',
        },
    ];

    return (
        <>
            <Container title={'Gestion des radios'}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <styled.Radio>
                        <h3>Radios - Points</h3>
                        <Table
                            scroll={{ y: 1000 }}
                            columns={Pointcolumns}
                            style={{ borderTop: '1px solid #ececec', borderRadius: '0px' }}
                            dataSource={meetingPoints.map((obj) => ({
                                key: obj.id,
                                ...obj,
                            }))}
                        />
                    </styled.Radio>
                    <styled.Radio>
                        <styled.Header>
                            <h3>Radios - Renforts</h3>
                            <Button onClick={() => setOpen(true)} style={{ marginBottom: '10px' }}>Ajouter une radio de renfort</Button>
                        </styled.Header>
                        <Table
                            scroll={{ y: 800 }}
                            columns={Agentcolumns}
                            style={{ borderTop: '1px solid #ececec', borderRadius: '0px' }}
                            dataSource={radios.filter(obj => obj.type === 'agent').map((obj) => ({
                                key: obj.id,
                                ...obj,
                            }))}
                        />
                    </styled.Radio>
                    <styled.Radio>
                        <styled.Header>
                            <h3>Radios - DPX</h3>
                            <Button onClick={() => setOpenDPX(true)} style={{ marginBottom: '10px' }}>Ajouter un DPX</Button>
                        </styled.Header>
                        <Table
                            scroll={{ y: 800 }}
                            columns={DPXcolumns}
                            style={{ borderTop: '1px solid #ececec', borderRadius: '0px' }}
                            dataSource={radios.filter(obj => obj.type === 'dpx').map((obj) => ({
                                key: obj.id,
                                ...obj,
                            }))}
                        />
                    </styled.Radio>
                </div>
            </Container>
            <Modal title="Ajouter une radio pour un renfort" open={open} onOk={handleOk} onCancel={handleCancel}>
                <RadioForm form={form} setRadios={setRadios} />
            </Modal>
            <Modal title="Ajouter une radio pour un DPX" open={openDPX} onOk={handleOkDPX} onCancel={handleCancelDPX}>
                <RadioFormDPX form={formDPX} setRadios={setRadios} />
            </Modal>
        </>
    );
};

export default Radios;
