import React from "react";
import axios from "axios";
import {Button, Input} from "antd";
import styled from "styled-components";
import NestedTableTrains from "../../components/nestedTableTrain/NestedTableTrains";
import GroupEditForm from "../../components/modal/groupEditForm/GroupEditForm";
import Container from "../../components/container/Container";

// Import component style
import { HeaderGroupContainer, HeaderTitle } from '../../style/groupsStyles.js';
import {SearchOutlined} from "@ant-design/icons";

const SupportedGroup = () => {
  const [TrainData, setTrainData] = React.useState([]);
  const [isDataImport, setIsDataImport] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [record, setRecord] = React.useState({});

  React.useEffect(() => {
    const getTrainsWithSupportedGroups = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_HOST}/train/train_groups_supported`,
      );
      setTrainData(data);
    };

    getTrainsWithSupportedGroups();
  }, [isDataImport]);

  const onCreate = async (values, form) => {
    await axios.patch(`${process.env.REACT_APP_API_HOST}/group/${values.group_id}`, values);
    setIsDataImport((c) => !c);
    setConfirmLoading(true);
    setTimeout(() => {
      form.resetFields();
      setOpen(false);
      setRecord({});
      setConfirmLoading(false);
    }, 2000);
  };

  const trainColumns = [
    {
      title: "No de train",
      dataIndex: "train_number",
      key: "train_number",
      width: 300,
    },
    { title: "Date", dataIndex: "train_date", key: "train_date", width: 400 },
    { title: "Heure", dataIndex: "train_hour", key: "train_hour" },
  ];

  const switchGroupType = async (record) => {
    await axios.patch(`${process.env.REACT_APP_API_HOST}/group/${record.group_id}/type/switch`);
    setIsDataImport(!isDataImport)
  }

  const expandedColumns = [
    {
      title: "Actions",
      key: "group_actions",
      render: (text, record) => (
          <>
            <Button
                onClick={() => {
                  setOpen((c) => !c);
                  setRecord(record);
                }}
            >
              Éditer
            </Button>
            <Button
                style={{ marginLeft: '10px' }}
                onClick={() => switchGroupType(record)}
            >
              Basculer en groupe autonome
            </Button>
          </>
      ),
    },
    {
      title: "Destination",
      dataIndex: "group_destination",
      key: "group_destination",
    },
    { title: "Nom groupe", dataIndex: "group_name", key: "group_name" },
    {
      title: "Total voyageurs",
      dataIndex: "group_total_travellers",
      key: "group_total_travellers",
      render: (text) => <p>{text} voyageurs</p>
    },
    {
      title: "N° Voiture",
      dataIndex: "group_car_number",
      key: "group_car_number",
    },
    { title: "Nature groupe", dataIndex: "group_type", key: "group_type" },
    {
      title: "Prestation",
      dataIndex: "group_prestation",
      key: "group_prestation",
      render: (text) => text ? 'BAGTM' : 'NON'
    },
    {
      title: "Point RV",
      dataIndex: "group_meeting_point",
      key: "group_meeting_point",
    },
    {
      title: "Heure RV",
      dataIndex: "group_meeting_time",
      key: "group_meeting_time",
    },
    {
      title: "Responsable JDD",
      dataIndex: "group_responsable_departure_day",
      key: "group_responsable_departure_day",
    },
    {
      title: "Tel. responsable JDD",
      dataIndex: "group_responsable_phone_departure_day",
      key: "group_responsable_phone_departure_day",
    },
    {
      title: "DPX (1 par train sensible)",
      dataIndex: "group_dpx",
      key: "group_dpx",
    },
  ];

  return (
    <Container title={'Groupes pris en charge'}>
      <div>
        <ListGroups>
          <HeaderTable>
            <div style={{ display: 'flex', flexDirection: 'row', width: '80%' }}>
              <Input style={{ marginRight: '20px', borderRadius: '6px', width: '40%', fontSize: '17px' }} placeholder="Rechercher un groupe" prefix={<SearchOutlined />} />
            </div>
          </HeaderTable>
          <NestedTableTrains
            columns={trainColumns}
            expandedColumns={expandedColumns}
            data={TrainData}
          />
          <GroupEditForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen((c) => !c);
              setRecord({});
            }}
            confirmLoading={confirmLoading}
            record={record}
          />
        </ListGroups>
      </div>
    </Container>
  );
};


const HeaderTable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
`;

const ListGroups = styled.div`
  width: auto;
  height: auto;
  margin: 25px 40px 40px 40px;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;

export default SupportedGroup;
