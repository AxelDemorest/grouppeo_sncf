import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { utils, read } from "xlsx";
import { Button } from "antd";
import axios from "axios";

import NestedTableTrains from "../../components/nestedTableTrain/NestedTableTrains";
import GroupEditForm from "../../components/modal/groupEditForm/GroupEditForm";
import Container from "../../components/container/Container";

// Component style
import { HeaderGroupContainer, HeaderTitle } from '../../style/groupsStyles.js';
import ImportGroups from "../../components/modal/importGroups/importGroups";
import UpdateGroups from "../../components/modal/updateGroups/UpdateGroups";

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

  useEffect(() => {
    const getTrains = async () => {
      const { data } = await axios.get("http://localhost:3001/train/train");
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
    const rows = [];

    const headersTrainDatabase = {
      "Dates ": "train_date",
      "No de train": "train_number",
      Heure: "train_hour",
    };

    const headersDatabase = {
      "Dates ": "group_meeting_date",
      "No de train": "train_number",
      Heure: "train_hour",
      Destination: "group_destination",
      "Nom groupe": "group_name",
      "Nbre places": "group_total_travellers",
      "N°\nVoiture": "group_car_number",
      "Nature groupe": "group_type",
      Prestation: "group_prestation",
      "Point RV": "group_meeting_point",
      "Heure RV": "group_meeting_time",
      "Responsable  jour du départ": "group_responsable_departure_day",
      "Tel \nresponsable": "group_responsable_phone_departure_day",
      "Bus (nbre)": "group_bus_number",
      Responsable: "group_responsable",
      "Téléphone responsable": "group_responsable_phone",
      "Nom vendeur": "group_seller_name",
      "Tél vendeur": "group_seller_phone",
      "DPX\n(1 par train sensible)": "group_dpx",
      Commentaires: "group_comment",
    };

    data.forEach((row) => {
      let rowData = {};
      let trainData = {};
      if (row.length > 0) {
        row.forEach((element, index) => {
          switch (headers[index]) {
            case "Dates ":
              rowData[headersTrainDatabase[headers[index]]] = element;
            case "No de train":
            case "Heure":
              trainData[headersTrainDatabase[headers[index]]] = element;
            default:
              rowData[headersDatabase[headers[index]]] =
                typeof element === "string" ? element.trim() : element;
          }
        });
        rows.push(rowData);
      }
    });
    return rows;
  };

  const importExcel = async (values, isImport) => {
    const file = values.trains.file;

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
        dateNF: "dd-mm-yyyy hh:mm",
      });
      const headers = fileData[0];

      fileData.splice(0, 1);
      const convertData = convertToJson(headers, fileData);
      const period = values.period;
      const body = {
        trains: convertData,
        period: period,
      };
      if (isImport) {
        await axios.post("http://localhost:3001/train/train", body);
      } else {
        await axios.patch("http://localhost:3001/train/train", body);
      }
      setIsDataImport(true);
    };

    if (file) {
      if (getExtension(file)) {
        reader.readAsBinaryString(file);
      }
    }
  };

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

  const onImport = async (values, form) => {
    setConfirmLoadingImport(true);
    importExcel(values, true);
    setTimeout(() => {
      form.resetFields();
      setOpenImportModal(false);
      setConfirmLoadingImport(false);
    }, 2000);
  };

  const onUpdate = async (values, form) => {
    setConfirmLoadingUpdate(true);
    importExcel(values, false);
    setTimeout(() => {
      form.resetFields();
      setOpenUpdateModal(false);
      setConfirmLoadingUpdate(false);
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
          <HeaderTitle>Suivi des groupes autonomes</HeaderTitle>
          <p>
            Tableau de tous les trains contenant des groupes autonomes avec des
            filtres applicables.
          </p>
        </HeaderGroupContainer>
        <ListGroups>
          <HeaderTable>
            <SearchInput
              placeholder="Rechercher un n° de train"
              style={{ width: 200 }}
            />
            <div>
              <Button onClick={() => setOpenUpdateModal((c) => !c)} style={{ marginRight: '20px' }}>
                Mettre à jour les groupes de saison
              </Button>
             <Button onClick={() => setOpenImportModal((c) => !c)}>
                Importer les groupes de saison
              </Button>
            </div>
          </HeaderTable>
          <NestedTableTrains
            columns={trainColumns}
            expandedColumns={expandedColumns}
            data={renderData}
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
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  padding: 8px;
  color: grey;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
`;

const ListGroups = styled.div`
  width: auto;
  height: auto;
  margin: 25px 40px 40px 40px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
`;

export default IndependentGroups;
