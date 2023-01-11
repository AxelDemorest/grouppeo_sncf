import React from "react";
import axios from "axios";
import { Button } from "antd";
import styled from "styled-components";
import NestedTableTrains from "../../components/nestedTableTrain/NestedTableTrains";
import GroupEditForm from "../../components/modal/groupEditForm/GroupEditForm";
import Container from "../../components/container/Container";

// Import component style
import { HeaderGroupContainer, HeaderTitle } from '../../style/groupsStyles.js';

const SupportedGroup = () => {
  const [TrainData, setTrainData] = React.useState([]);
  const [isDataImport, setIsDataImport] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [record, setRecord] = React.useState({});

  React.useEffect(() => {
    const getTrainsWithSupportedGroups = async () => {
      const { data } = await axios.get(
        "http://localhost:3001/train/train_groups_supported"
      );
      setTrainData(data);
    };

    getTrainsWithSupportedGroups();
  }, [isDataImport]);

  const onCreate = async (values, form) => {
    await axios.patch(`http://localhost:3001/group/${values.group_id}`, values);
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

  const expandedColumns = [
    {
      title: "Actions",
      key: "group_actions",
      render: (text, record) => (
        <Button
          onClick={() => {
            setOpen((c) => !c);
            setRecord(record);
          }}
        >
          Éditer
        </Button>
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
      title: "Bus (nbre)",
      dataIndex: "group_bus_number",
      key: "group_bus_number",
    },
    {
      title: "Responsable",
      dataIndex: "group_responsable",
      key: "group_responsable",
    },
    {
      title: "Tel. responsable",
      dataIndex: "group_responsable_phone",
      key: "group_responsable_phone",
    },
    {
      title: "Nom vendeur",
      dataIndex: "group_seller_name",
      key: "group_seller_name",
    },
    {
      title: "Tel. vendeur",
      dataIndex: "group_seller_phone",
      key: "group_seller_phone",
    },
    {
      title: "DPX (1 par train sensible)",
      dataIndex: "group_dpx",
      key: "group_dpx",
    },
    { title: "Commentaires", dataIndex: "group_comment", key: "group_comment" },
  ];

  return (
    <Container>
      <div>
        <HeaderGroupContainer>
          <HeaderTitle>Suivi des groupes pris en charges</HeaderTitle>
          <p>
            Tableau de tous les trains pris en charges par des agents avec des
            filtres applicables.
          </p>
        </HeaderGroupContainer>
        <ListGroups>
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

const ListGroups = styled.div`
  width: auto;
  height: auto;
  margin: 25px 40px 40px 40px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
`;

export default SupportedGroup;
