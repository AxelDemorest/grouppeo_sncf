import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import styled from "styled-components";

const UpdateGroups = ({
    open,
    onCreate,
    onCancel,
    confirmLoading,
}) => {
    const [form] = Form.useForm();

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            onCreate(values, form);
        }).catch((errorInfo) => {
            console.log(errorInfo);
        });
    };

    return (
        <>
            <Modal destroyOnClose
                style={{ top: '150px' }}
                bodyStyle={{ height: 180 }}
                width={1000}
                title="Mettre à jour les groupes d'une saison"
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
                        getValueFromEvent={normFile} >
                        <Upload accept=".xls, .xlsx" beforeUpload={() => {
                            return false;
                        }}>
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </FormItem>
                    <FormItem name="period" label="Période">
                        <Input placeholder="indiquez le nom de la saison que vous importez (ex : Hiver2022)" />
                    </FormItem>
                </Form>
                <p>le fichier que vous importez supprimera les anciennes données et les remplacera par les données de ce nouveau tableau. Attention, si le nom de la période ne correspond à aucun fichier, l'import de fonctionnera pas.</p>
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

export default UpdateGroups;