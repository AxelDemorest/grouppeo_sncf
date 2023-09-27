import React from 'react';
import {Input, Modal} from "antd";
import {fetchTrainByNumber} from "../../../../api/services/trainServices";

const TrainModal = ({ isModalOpen, setIsModalOpen, setTrain, setFormVisible, messageApi, day }) => {
    const [trainValue, setTrainValue] = React.useState('');
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            const response = await fetchTrainByNumber(trainValue.trim(), day);
            setTrain(response);
            setIsModalOpen(false);
        } catch (e) {
            setIsModalOpen(false);
            messageApi.open({
                type: 'error',
                content: 'Le train n\'existe pas.',
            });
        }
        setConfirmLoading(false);
        setTrainValue('');
        setFormVisible(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    return (
        <Modal
            title="Vérifier l'existance du train"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okButtonProps={{ disabled: trainValue.trim() === '' }}
        >
            <Input value={trainValue} onChange={(e) => setTrainValue(e.target.value)} placeholder="Indiquez le numéro du train" />
        </Modal>
    );
};

export default TrainModal;
