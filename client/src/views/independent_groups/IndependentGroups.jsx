import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { utils, read } from "xlsx";
import { Button, Select, Input } from "antd";
import axios from "axios";

import NestedTableTrains from "../../components/nestedTableTrain/NestedTableTrains";
import GroupEditForm from "../../components/modal/groupEditForm/GroupEditForm";
import Container from "../../components/container/Container";

// Component style
import { HeaderGroupContainer, HeaderTitle } from '../../style/groupsStyles.js';
import ImportGroups from "../../components/modal/importGroups/importGroups";
import UpdateGroups from "../../components/modal/updateGroups/UpdateGroups";
import {SearchOutlined} from "@ant-design/icons";

const EXTENSIONS = ["xlsx", "xls"];

const IndependentGroups = () => {
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

  useEffect(() => {
    const getTrains = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_HOST}/train/train`);
      setRenderData(data);
    };

    getTrains();
  }, [isDataImport]);

  const getExtension = (file) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension);
  };

  const convertToJson = (headers, data) => {
    const headersDatabase = {
      "Date-départ": "train_date",
      "N°-train": "train_number",
      "Heure-départ": "train_hour",
      "Destination": "group_destination",
      "Nom-groupe": "group_name",
      "Nombre-pax": "group_total_travellers",
      "N°-voiture": "group_car_number",
      "Type-Groupe": "group_type",
      "Prestation": "group_prestation",
      "Point-RV": "group_meeting_point",
      "Heure-RV": "group_meeting_time",
      "Responsable-jour-du-départ": "group_responsable_departure_day",
      "Tel-responsable": "group_responsable_phone_departure_day",
      "Mail": "group_mail",
    };

    return data
        .filter(row => row.length > 0)
        .map(row =>
            row.reduce((rowData, element, index) => {
              const headersFormat = headersDatabase[headers[index].trim().replace(new RegExp(' ', 'g'), '-')];

              if (!headersFormat) return rowData;

              if (headersFormat.trim() === "train_hour") {
                element = element.split(' ')[1] || ''
              } else if (headersFormat.trim() === "train_date") {
                element = new Date(element).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }) || ''
              } else if (headersFormat.trim() === "group_prestation") {
                element = element === 'BAGTM';
              }

              return { ...rowData, [headersFormat]: headersFormat.trim() === "group_prestation" ? element : element.toString().trim() }
            }, {})
        );
  };

  const performAxiosCall = async (url, body, isImport) => {
    if (isImport) {
      await axios.post(url, body);
    } else {
      await axios.patch(url, body);
    }
  };

  const importExcel = async (values, isImport) => {
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

      await performAxiosCall(`${import.meta.env.VITE_API_HOST}/train/`, body, isImport);
      setIsDataImport(true);
    };

    if (getExtension(file)) {
      reader.readAsBinaryString(file);
    }
  };

  const onCreate = async (values, form) => {
    await axios.patch(`${import.meta.env.VITE_API_HOST}/group/${values.group_id}`, values);
    setIsDataImport((c) => !c);
    setConfirmLoading(true);
    setTimeout(() => {
      form.resetFields();
      setOpen(false);
      setRecord({});
      setConfirmLoading(false);
    }, 2000);
  };

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
    await axios.patch(`${import.meta.env.VITE_API_HOST}/group/${record.group_id}/type/switch`);
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
    { title: "Période", dataIndex: "train_period", key: "train_period" },
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

  return (
    <Container title={'Groupes autonomes'}>
      <div>
        <ListGroups>
          <HeaderTable>
            <div style={{ display: 'flex', flexDirection: 'row', width: '80%' }}>
              <Input
                  onChange={inputHandler}
                  style={{ marginRight: '20px', borderRadius: '6px', width: '40%', fontSize: '17px' }}
                  placeholder="Rechercher par numéro de train ou nom de groupe"
                  prefix={<SearchOutlined />}
              />
            </div>
            <div style={{ width: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpenUpdateModal((c) => !c)} style={{ marginRight: '20px' }}>
                Mettre à jour les groupes de saison
              </Button>
             <Button onClick={() => setOpenImportModal((c) => !c)} style={{ marginRight: '20px' }}>
                Importer les groupes de saison
              </Button>
              <Button onClick={() => setOpenImportModal((c) => !c)}>
                Importer les voies via OpenGOV
              </Button>
            </div>
          </HeaderTable>
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
  height: auto;
  width: auto;
  margin: 25px 40px 40px 40px;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;

export default IndependentGroups;
