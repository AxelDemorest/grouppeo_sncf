import { Form, Input, Modal, Select } from "antd";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const useResetFormOnCloseModal = ({ form, open }) => {
  const prevOpenRef = useRef();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;
  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};

const GroupEditForm = ({
  open,
  onCreate,
  onCancel,
  confirmLoading,
  record,
}) => {
  const [form] = Form.useForm();

  useResetFormOnCloseModal({
    form,
    open,
  });

  useEffect(() => form.resetFields(), [record, form]);

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
          onOk={handleOk}
          onCancel={() => {
            form.resetFields();
            onCancel();
          }}
          okText="Mettre à jour"
          cancelText="Retour"
          confirmLoading={confirmLoading}
        >
          <FormModal
            form={form}
            layout="vertical"
            name="edit_group_form"
            initialValues={record}
          >
            <FormItem hidden={true} name="group_id" label="Destination">
              <Input />
            </FormItem>
            <FormItem name="group_destination" label="Destination">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_name" label="Nom du groupe">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_total_travellers" label="Total voyageurs">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_car_number" label="N° Voiture">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="group_type" label="Nature du groupe">
              <Select>
                <Select.Option value="true">Autonome</Select.Option>
                <Select.Option value="false">Enfant</Select.Option>
                <Select.Option value="false">Handicapé</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="group_prestation" label="Prestation">
              <Select>
                <Select.Option value="true">Oui</Select.Option>
                <Select.Option value="false">Non</Select.Option>
              </Select>
            </FormItem>
            <FormItem name="group_meeting_point" label="Point RV">
              <Input />
            </FormItem>
            <FormItem name="group_meeting_time" label="Heure RV">
              <Input />
            </FormItem>
            <FormItem
              name="group_responsable_departure_day"
              label="Responsable jour du départ"
            >
              <Input />
            </FormItem>
            <FormItem
              name="group_responsable_phone_departure_day"
              label="Tel. responsable jour du départ"
            >
              <Input />
            </FormItem>
            <FormItem name="group_bus_number" label="Bus (nbre)">
              <Input />
            </FormItem>
            <FormItem name="group_responsable" label="Responsable">
              <Input />
            </FormItem>
            <FormItem name="group_responsable_phone" label="Tel. responsable">
              <Input />
            </FormItem>
            <FormItem name="group_seller_name" label="Nom vendeur">
              <Input />
            </FormItem>
            <FormItem name="group_seller_phone" label="Tel. vendeur">
              <Input />
            </FormItem>
            <FormItem name="group_dpx" label="DPX (1 par train sensible)">
              <Input />
            </FormItem>
          </FormModal>
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
