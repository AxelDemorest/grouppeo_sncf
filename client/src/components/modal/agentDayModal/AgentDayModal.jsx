import React, { useEffect, useState } from "react";
import { DatePicker, Form, Input, Modal, Select } from "antd";
import styled from "styled-components";

const AgentDayModal = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
    userId,
}) => {
    const [datePicker, setDatePicker] = useState();

    const handleOk = () => {
        onCreate(datePicker, userId);
    };

    const onChange = (date, dateString) => {
       setDatePicker(new Date(dateString).toDateString());
    };

    return (
        <>
            <Modal
                style={{ top: '150px' }}
                bodyStyle={{ height: 200 }}
                width={1000}
                title="Assigner une journée"
                open={open}
                onOk={handleOk}
                onCancel={() => {
                    onCancel();
                }}
                okText="Assigner"
                cancelText="Retour"
                confirmLoading={confirmLoading}
            >
                <p>Choisissez une date à laquelle le renfort sera sur le terrain</p>
                <DatePicker
                    onChange={onChange}
                    style={{ width: '50%', marginBottom: '15px' }}
                />
                <p>Lors de la validation du formulaire, le renfort sera affiché sur la liste de droite si la date indiquée correspond à la date d'aujourd'hui.</p>
            </Modal>
        </>
    );
};

export default AgentDayModal;