import { Form, Input, Modal, Select } from "antd";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const GroupEditForm = ({
  open,
  onCreate,
  onCancel,
  confirmLoading,
  record,
}) => {
  const [form] = Form.useForm();

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
      {Object.keys(record).length > 0 && (
        <Modal
          title="Éditer le groupe"
          open={open}
          destroyOnClose
          onOk={handleOk}
          onCancel={() => {
            form.resetFields();
            onCancel();
          }}
          okText="Mettre à jour"
          cancelText="Retour"
          confirmLoading={confirmLoading}
        >
          <Form preserve={false}
            form={form}
            layout="vertical"
            name="edit_group_form"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <FormItem hidden={true} name="group_id" initialValue={record.group_id} label="Destination">
              <Input />
            </FormItem>
            <FormItem name="group_destination" initialValue={record.group_destination}  label="Destination">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_name" initialValue={record.group_name} label="Nom du groupe">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_total_travellers" label="Total voyageurs">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_car_number" initialValue={record.group_car_number} label="N° Voiture">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_type" initialValue={record.group_type} label="Nature du groupe">
              <Select>
                <Select.Option value="true">Autonome</Select.Option>
                <Select.Option value="false">Enfant</Select.Option>
                <Select.Option value="false">Handicapé</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="group_prestation" initialValue={record.group_prestation} label="Prestation">
              <Select>
                <Select.Option value="true">Oui</Select.Option>
                <Select.Option value="false">Non</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="group_meeting_point" initialValue={record.group_meeting_point} label="Point RV">
              <Input />
            </FormItem>
            <FormItem name="group_meeting_time" initialValue={record.group_meeting_time} label="Heure RV">
              <Input />
            </FormItem>
            <FormItem
              name="group_responsable_departure_day"
              label="Responsable jour du départ"
              initialValue={record.group_responsable_departure_day}
            >
              <Input />
            </FormItem>
            <FormItem
              name="group_responsable_phone_departure_day"
              label="Tel. responsable jour du départ"
              initialValue={record.group_responsable_phone_departure_day}
            >
              <Input />
            </FormItem>
            <FormItem name="group_bus_number" label="Bus (nbre)" initialValue={record.group_bus_number}>
              <Input />
            </FormItem>
            <FormItem name="group_responsable" label="Responsable" initialValue={record.group_responsable}>
              <Input />
            </FormItem>
            <FormItem name="group_responsable_phone" label="Tel. responsable" initialValue={record.group_responsable_phone}>
              <Input />
            </FormItem>
            <FormItem name="group_seller_name" label="Nom vendeur" initialValue={record.group_seller_name}>
              <Input />
            </FormItem>
            <FormItem name="group_seller_phone" label="Tel. vendeur" initialValue={record.group_seller_phone}>
              <Input />
            </FormItem>
            <FormItem name="group_dpx" label="DPX (1 par train sensible)" initialValue={record.group_dpx}>
              <Input />
            </FormItem>
          </Form>
        </Modal>
      )}
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

export default GroupEditForm;
