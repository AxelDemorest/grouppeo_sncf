import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import { utils, read } from "xlsx";
import {Button, Select, Input, message, DatePicker} from "antd";
import axios from "axios";

import NestedTableTrains from "../../../components/nestedTableTrain/NestedTableTrains";
import GroupEditForm from "../../../components/modal/groupEditForm/GroupEditForm";
import Container from "../../../components/container/Container";

// Component style
import ImportGroups from "../../../components/modal/importGroups/importGroups";
import UpdateGroups from "../../../components/modal/updateGroups/UpdateGroups";
import {SearchOutlined} from "@ant-design/icons";
import EditableCellTrain from "../components/EditableCell/EditableCell";
import {convertToJson} from "../../../utils/excel";

const EXTENSIONS = ["xlsx", "xls"];

const AutonomousGroups = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDataImport, setIsDataImport] = useState(false);
  const [renderData, setRenderData] = useState([]);
  const [record, setRecord] = useState({});
  const [open, setOpen] = useState(false);

  const [openImportModal, setOpenImportModal] = useState(false);
  const [confirmLoadingImport, setConfirmLoadingImport] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);

  const [inputText, setInputText] = useState("");

  const importExcel = useCallback(async (values, isImport) => {
    const file = values.trains[0].originFileObj;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const bstr = event.target.result;
      const workBook = read(bstr, {
        type: "binary",
        cellText: false,
        cellDates: true,
      });

      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];

      const fileData = utils.sheet_to_json(workSheet, {
        header: 1,
        raw: false,
        dateNF: "yyyy-mm-dd hh:mm",
      });
      const [headers, ...data] = fileData;
      const convertData = convertToJson(headers, data);
      const period = values.period;
      const body = {
        trains: convertData,
        period,
      };

      await performAxiosCall(`${import.meta.env.VITE_API_HOST}/api/train/`, body, isImport);
      setIsDataImport(true);
    };

    if (getExtension(file)) {
      reader.readAsBinaryString(file);
    }
  }, []);

  const getExtension = (file) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension);
  };

  const performAxiosCall = async (url, body, isImport) => {
    if (isImport) {
      await axios.post(url, body);
    } else {
      await axios.patch(url, body);
    }
  };

  const onCreate = useCallback(async (values, form) => {
    await axios.patch(`${import.meta.env.VITE_API_HOST}/api/group/${values.group_id}`, values);
    setIsDataImport((c) => !c);
    setConfirmLoading(true);
    setTimeout(() => {
      form.resetFields();
      setOpen(false);
      setRecord({});
      setConfirmLoading(false);
    }, 2000);
  }, []);

  const onImport = async (values, form) => {
    setConfirmLoadingImport(true);
    await importExcel(values, true);
    setTimeout(() => {
      form.resetFields();
      setOpenImportModal(false);
      setConfirmLoadingImport(false);
    }, 2000);
  };

  const onUpdate = async (values, form) => {
    setConfirmLoadingUpdate(true);
    await importExcel(values, false);
    setTimeout(() => {
      form.resetFields();
      setOpenUpdateModal(false);
      setConfirmLoadingUpdate(false);
    }, 2000);
  };

  const switchGroupType = async (record) => {
    await axios.patch(`${import.meta.env.VITE_API_HOST}/api/group/${record.group_id}/type/switch`);
    setIsDataImport(!isDataImport)
  }

  const trainColumns = [
    {
      title: "No de train",
      dataIndex: "train_number",
      key: "train_number",
      width: 300,
    },
    { title: "Date", dataIndex: "train_date", key: "train_date", width: 400 },
    { title: "Heure", dataIndex: "train_hour", key: "train_hour" },
    {
      title: "Voie",
      dataIndex: "train_track",
      key: "train_track",
      render: (text, record) => <EditableCellTrain text={text} record={record} messageApi={messageApi}/>,
    },
  ];

  const expandedColumns = [
    {
      title: "Actions",
      key: "group_actions",
      width: 330,
      render: (text, record) => (
          <>
            <Button
                style={{ marginRight: '10px' }}
                onClick={() => {
                  setOpen((c) => !c);
                  setRecord(record);
                }}
            >
              Éditer
            </Button>
            <Button
                style={{ marginTop: '10px' }}
                onClick={() => {
                  switchGroupType(record);
                }}
            >
              Basculer en groupe sensible
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
  ];

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const handleDateChange = async (date, dateString) => {
    const dateFormat = new Date(dateString).toLocaleDateString(
        'fr-FR',
        { year: 'numeric', month: '2-digit', day: '2-digit' }
    )

    const result = await axios.get(`${import.meta.env.VITE_API_HOST}/api/train/day?day=${dateFormat}`);

    setRenderData(result.data);
  };

  return (
      <>
        {contextHolder}
        <Container title={'Groupes autonomes'}>
          <div>
            <ListGroups>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', height: '34px'}}>
                    <Input
                        onChange={inputHandler}
                        style={{ margin: '0 20px 10px 20px', borderRadius: '6px', width: '90%', padding: '4px 6px', height: '34px' }}
                        placeholder="Rechercher un train ou un groupe"
                        prefix={<SearchOutlined />}
                    />
                    <DatePicker onChange={handleDateChange} style={{ width: '300px', height: '34px' }} />
                  </div>
                  <div style={{ width: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setOpenUpdateModal((c) => !c)} style={{ marginRight: '20px' }}>
                      Mettre à jour les groupes de saison
                    </Button>
                    <Button onClick={() => setOpenImportModal((c) => !c)}>
                      Importer les groupes de saison
                    </Button>
                  </div>
                </div>
                <NestedTableTrains
                    columns={trainColumns}
                    expandedColumns={expandedColumns}
                    data={renderData}
                    inputText={inputText}
                />
            </ListGroups>
          </div>
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
          <ImportGroups
              open={openImportModal}
              onCreate={onImport}
              onCancel={() => {
                setOpenImportModal((c) => !c);
              }}
              confirmLoading={confirmLoadingImport}
          />
          <UpdateGroups
              open={openUpdateModal}
              onCreate={onUpdate}
              onCancel={() => {
                setOpenUpdateModal((c) => !c);
              }}
              confirmLoading={confirmLoadingUpdate}
          />
        </Container>
      </>
  );
};

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

export default AutonomousGroups;
