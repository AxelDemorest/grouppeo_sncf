import React, {useState} from "react";
import axios from "axios";
import {Button, Input, DatePicker, message} from "antd";
import styled from "styled-components";
import NestedTableTrains from "../../../components/nestedTableTrain/NestedTableTrains";
import GroupEditForm from "../../../components/modal/groupEditForm/GroupEditForm";
import Container from "../../../components/container/Container";

// Import component style
import {SearchOutlined} from "@ant-design/icons";
import EditableCellTrain from "../components/EditableCell/EditableCell";

const SupportGroups = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [TrainData, setTrainData] = React.useState([]);
  const [isDataImport, setIsDataImport] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [record, setRecord] = React.useState({});
  const [inputText, setInputText] = useState("");

  const onCreate = async (values, form) => {
    await axios.patch(`${import.meta.env.VITE_API_HOST}/api/group/${values.group_id}`, values);
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
      title: 'ID',
      dataIndex: 'train_id',
      key: 'train_id',
      hidden: true,
    },
    {
      title: "No de train",
      dataIndex: "train_number",
      key: "train_number",
      width: 300,
    },
    { title: "Date", dataIndex: "train_date", key: "train_date", width: 300 },
    { title: "Heure", dataIndex: "train_hour", key: "train_hour", width: 300 },
    {
      title: "Voie",
      dataIndex: "train_track",
      key: "train_track",
      render: (text, record) => <EditableCellTrain text={text} record={record} messageApi={messageApi}/>,
    },
  ];

  const switchGroupType = async (record) => {
    await axios.patch(`${import.meta.env.VITE_API_HOST}/api/group/${record.group_id}/type/switch`);
    setIsDataImport(!isDataImport)
  }

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

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

  const handleDateChange = async (date, dateString) => {
    const dateFormat = new Date(dateString).toLocaleDateString(
        'fr-FR',
        { year: 'numeric', month: '2-digit', day: '2-digit' }
    )

    const result = await axios.get(`${import.meta.env.VITE_API_HOST}/api/train/day?day=${dateFormat}`);

    setTrainData(result.data);
  };

  return (
      <>
        {contextHolder}
        <Container title={'Groupes pris en charge'}>
          <div>
            <ListGroups>
              <div style={{ display: 'flex', flexDirection: 'row', height: '34px'}}>
                <Input
                    onChange={inputHandler}
                    style={{ margin: '0 20px 10px 20px', borderRadius: '6px', width: '10%', padding: '4px 6px', height: '34px' }}
                    placeholder="Rechercher un train ou un groupe"
                    prefix={<SearchOutlined />}
                />
                <DatePicker onChange={handleDateChange} style={{ width: '300px', height: '34px' }} />
              </div>
                <NestedTableTrains
                    columns={trainColumns.filter((column) => !column.hidden)}
                    expandedColumns={expandedColumns}
                    data={TrainData}
                    inputText={inputText}
                />
            </ListGroups>
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
          </div>
        </Container>
      </>
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
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  margin: 25px 40px 40px 40px;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fff;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;

export default SupportGroups;
