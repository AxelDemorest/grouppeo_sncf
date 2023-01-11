import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";

const ImportGroups = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
}) => {
    const [message, setMessage] = useState("");
    const [form] = Form.useForm();
    const handleChange = event => {
        setMessage(event.target.value);
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
                            console.log(file);

                            return false;
                        }}>
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </FormItem>
                    <FormItem name="period" label="Période">
                        <Input onChange={handleChange} value={message} placeholder="indiquez le nom de la saison que vous importez (ex : Hiver2022)" />
                    </FormItem>
                </Form>
                <p>Notez bien le nom de la période que vous saisissez dans le champs car si vous uploadez une nouvelle version du fichier, il faudrait noter le nom de la période exacte.</p>
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
  width: 45%;
`;

export default ImportGroups;