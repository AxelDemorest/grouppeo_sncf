import React, { useState } from "react";
import {DatePicker, Form, Modal} from "antd";
import styled from "styled-components";

const GenerateProg = ({
      open,
      onCreate,
      onCancel,
      confirmLoading,
  }) => {
    const [datePicker, setDatePicker] = useState('');

    const handleOk = () => {
        onCreate(datePicker);
    };

    const onChange = (date, dateString) => {
        const formatDate = new Date(dateString).toLocaleDateString(
            'fr-FR',
            { year: 'numeric', month: '2-digit', day: '2-digit' }
        )
        setDatePicker(formatDate);
    };

    return (
        <>
            <Modal
                style={{ top: '150px' }}
                bodyStyle={{ height: 200 }}
                width={1000}
                title="Générer une programmation sur une journée"
                open={open}
                onOk={handleOk}
                onCancel={() => {
                    onCancel();
                }}
                okText="Générer"
                cancelText="Retour"
                confirmLoading={confirmLoading}
            >
                <p>Choisissez la journée à générer</p>
                <DatePicker
                    onChange={onChange}
                    style={{ width: '50%', marginBottom: '15px' }}
                />
                <p>Lors de la validation du formulaire, chaque renfort assigné à la journée disposera de sa programmation. Les renforts ont une page dédiée où ils peuvent visualiser leurs programmations.</p>
            </Modal>
        </>
    );
};

export default GenerateProg;
