import React, {useState} from "react";
import axios from "axios";
import {Input} from "antd";

const EditableCellTrain = ({ text, record, messageApi }) => {
    const [value, setValue] = useState(text);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        let updatedRecord = {
            train_track: value
        };

        axios.patch(`${import.meta.env.VITE_API_HOST}/api/train/${record.train_id}`, updatedRecord)
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Voie modifiée avec succès',
                });
            }).catch(err => {
            console.error(err)
        });
        console.log(`Call API with value: ${value}`);
    };

    return <Input value={value} placeholder={!value ? 'Indiquez la voie prévue pour le train' : ''} onChange={handleChange} onBlur={handleBlur} style={{ width: '270px' }} />;
};

export default EditableCellTrain;
