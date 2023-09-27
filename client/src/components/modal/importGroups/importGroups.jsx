import React, { useState } from "react";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";
import axios from "axios";

const ImportGroups = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
}) => {
    const [message, setMessage] = useState("");
    const [isValidPeriod, setIsValidPeriod] = useState(false);
    const [form] = Form.useForm();
    const handleChange = async (event) => {
        setMessage(event.target.value);
        const period = await axios.get(`${import.meta.env.VITE_API_HOST}/api/period/${event.target.value}`)
        if (!period.data) setIsValidPeriod(false)
        else setIsValidPeriod(true)
    };
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onCreate(values, form);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <>
            <Modal destroyOnClose
                style={{ top: '150px' }}
                bodyStyle={{ height: 180 }}
                width={1000}
                title="Importer les groupes de saison"
                open={open}
                onOk={handleOk}
                onCancel={() => {
                    form.resetFields();
                    onCancel();
                }}
                okText="Importer"
                cancelText="Retour"
                confirmLoading={confirmLoading}
            >

                <Form
                    preserve={false}
                    style={{ display: "flex" }}
                    form={form}
                    layout="vertical"
                    name="import_groups"
                >
                    <FormItem name="trains" label="Fichier des trains" valuePropName="fileList"
                        getValueFromEvent={normFile}>
                        <Upload accept=".xls, .xlsx" beforeUpload={file => {
                            return false;
                        }}>
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </FormItem>
                    <div>
                        <FormItem name="period" label="Période">
                            <Input
                                onChange={handleChange}
                                value={message}
                                placeholder="indiquez le nom de la saison que vous importez (ex : Hiver2022)"
                                style={{ width: '400px' }}
                            />
                        </FormItem>
                        <p>{ isValidPeriod && message.length > 0 ? 'La période existe' : 'La période n\'existe pas' }</p>
                    </div>
                </Form>
                <p style={{ color: 'red', fontWeight: 'bold' }}>Assignez correctement les jours aux bonnes périodes, par exemple, tout le mois de juillet dans la période Été 2023</p>
            </Modal>
        </>
    );
};

const FormModal = styled(Form)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const FormItem = styled(Form.Item)`
  margin-right: 20px !important;
  margin-bottom: 5px;
  width: 45%;
`;

export default ImportGroups;
