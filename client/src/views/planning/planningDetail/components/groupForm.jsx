import React from 'react';
import {Button, Form, Input, Select} from "antd";
import styled from "styled-components";
import {createGroup, fetchIsolatedGroups} from "../../../../api/services/groupServices";

const GroupForm = ({ train, date, setIsFormVisible, setIsolatedGroups, messageApi }) => {

    const onFinish = async (values) => {
        const { train_number, train_hour, ...restValues } = values;

        let formatValues = {
            ...restValues,
            group_is_supported: true,
            group_train: train
        };

        if (!train || Object.keys(train).length === 0) {
            formatValues = {
                ...restValues,
                group_is_supported: true,
                group_train: {
                    train_number,
                    train_hour,
                    train_date: date.replace(new RegExp('-', 'g'), '/'),
                }
            };
        }

        await createGroup(formatValues);
        const isolatedGroups = await fetchIsolatedGroups(date);
        setIsolatedGroups(isolatedGroups);
        setIsFormVisible(false);
        messageApi.open({
            type: 'success',
            content: 'Groupe crée avec succès et déplacé directement en groupe isolé',
        });
    }

    return (
        <CustomForm>
            <h3 style={{ padding: '5px 0' }}>Créer un groupe</h3>
            <Form onFinish={onFinish} style={{ maxWidth: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', padding: '5px 0' }}>
                {!train || Object.keys(train).length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
                        <p style={{ marginBottom: '0', marginRight: '5px' }}>Informations du train :</p>
                        <Form.Item
                            name="train_number"
                            rules={[{ required: true, message: "Champs obligatoire" }]}
                            style={{ margin: '0 10px 0 0' }}
                        >
                            <Input placeholder="Numéro du train" style={{ width: 150 }} />
                        </Form.Item>
                        <Form.Item
                            name="train_hour"
                            rules={[{ required: true, message: "Champs obligatoire" }]}
                            style={{ margin: '0 10px 0 0' }}
                        >
                            <Input placeholder="Heure du train" style={{ width: 150 }} />
                        </Form.Item>
                    </div>
                ) : null}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <p style={{ marginBottom: '0', marginRight: '5px' }}>Informations du groupe :</p>
                    <Form.Item
                        name="group_name"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Nom du groupe" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_destination"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Destination du groupe" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_type"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Select
                            placeholder={'Nature du groupe'}
                            style={{
                                width: 120,
                            }}
                            options={[
                                {
                                    value: 'autonome',
                                    label: 'Autonome',
                                },
                                {
                                    value: 'enfant',
                                    label: 'Enfant',
                                },
                                {
                                    value: 'handicapé',
                                    label: 'Handicapé',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="group_total_travellers"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Nombre de voyageurs" style={{ width: 170 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_car_number"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Numéros des voitures" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_meeting_time"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Heure de RDV" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_meeting_point"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Point de RDV" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_prestation"
                        rules={[{ required: true, message: "Champs obligatoire" }]}
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Select
                            placeholder={'Prestation'}
                            style={{
                                width: 120,
                            }}
                            options={[
                                {
                                    value: true,
                                    label: 'Oui',
                                },
                                {
                                    value: false,
                                    label: 'Non',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="group_responsable_departure_day"
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Nom du responsable" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="group_responsable_phone_departure_day"
                        style={{ margin: '0 10px 0 0' }}
                    >
                        <Input placeholder="Numéro Tel. du responsable" style={{ width: 200 }} />
                    </Form.Item>
                </div>
                <Form.Item style={{ marginTop: '20px', marginBottom: '0' }}>
                    <Button htmlType="submit" style={{ margin: '0 10px 0 0' }}>
                        Soumettre
                    </Button>
                </Form.Item>
            </Form>
        </CustomForm>
    );
};

const CustomForm = styled.div`
  margin: 25px 40px 0 40px;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
`;

export default GroupForm;
