import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { utils, read } from 'xlsx';
import { BiImport } from 'react-icons/bi';
import Container from '../../components/container/Container';
import NestedTableTrains from '../../components/nestedTableTrain/NestedTableTrains';

const EXTENSIONS = ['xlsx', 'csv', 'xls']

const IndependentGroups = () => {
    const [data, setData] = useState([]);
    const [trains, setTrains] = useState();

    useEffect(() => {
        const getTrains = async () => {
            const { data } = await axios.get('http://localhost:3001/train/train');
            setData(data);
            console.log(data);
        };

        getTrains();
    }, []);

    const getExtension = (file) => {
        const parts = file.name.split('.');
        const extension = parts[parts.length - 1];
        return EXTENSIONS.includes(extension);
    };

    const convertToJson = (headers, data) => {
        const rows = [];
        const trainRows = [];

        const headersTrainDatabase = {
            'Dates ' : 'train_date',
            'No de train' : 'train_number',
            'Heure' : 'train_hour',
        }

        const headersDatabase= { 
            'Dates ' : 'group_meeting_date',
            'No de train' : 'train_number',
            'Heure' : 'train_hour',
            'Destination' : 'group_destination',
            'Nom groupe' : 'group_name',
            'Nbre places' : 'group_total_travellers',
            'N°\nVoiture' : 'group_car_number',
            'Nature groupe' : 'group_type',
            'Prestation' : 'group_prestation',
            'Point RV' : 'group_meeting_point',
            'Heure RV' : 'group_meeting_time',
            'Responsable  jour du départ' : 'group_responsable_departure_day',
            'Tel \nresponsable' : 'group_responsable_phone_departure_day',
            'Bus (nbre)' : 'group_bus_number',
            'Responsable' : 'group_responsable',
            'Téléphone responsable' : 'group_responsable_phone',
            'Nom vendeur' : 'group_seller_name',
            'Tél vendeur' : 'group_seller_phone',
            'DPX\n(1 par train sensible)' : 'group_dpx',
            'Commentaires' : 'group_comment',
        };

        // TODO: Check si le train existe déjà dans le tableau
        data.forEach(row => {
            let rowData = {};
            let trainData = {};
            if(row.length > 0) {
                row.forEach((element, index) => {
                    switch(headers[index]) {
                        case 'Dates ':
                            rowData[headersTrainDatabase[headers[index]]] = element;
                        case 'No de train':
                        case 'Heure':
                            trainData[headersTrainDatabase[headers[index]]] = element;
                        default:
                            rowData[headersDatabase[headers[index]]] = typeof element === 'string' ? element.trim() : element;
                    }
                });
                rows.push(rowData);
                trainRows.push(trainData);
            }
        });
        setTrains(trainRows);
        return rows;
    };

    const importExcel = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            const bstr = event.target.result;
            const workBook = read(bstr, { type: 'binary', cellText: false, cellDates: true });

            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];

            const fileData = utils.sheet_to_json(workSheet, { header: 1, raw: false, dateNF: 'dd-mm-yyyy hh:mm' });
            const headers = fileData[0];
            // const heads = headers.map(head => ({ title: head, field: head }))
            fileData.splice(0, 1);
            setData(convertToJson(headers, fileData));
        };

        if(file) {
            if(getExtension(file)) {
                reader.readAsBinaryString(file);
            }
        } else {
            setData([]);
        }
    }

    const trainColumns = [
        { title: 'Dates', dataIndex: 'train_date', key: 'train_date' },
        { title: 'No de train', dataIndex: 'train_number', key: 'train_number' },
        { title: 'Heures', dataIndex: 'train_hour', key: 'train_hour' },
    ];

    const expandedColumns = [
        { title: 'Destination', dataIndex: 'group_destination', key: 'group_destination' },
        { title: 'Nom groupe', dataIndex: 'group_name', key: 'group_name' },
        { title: 'Total voyageurs', dataIndex: 'group_total_travellers', key: 'group_total_travellers' },
        { title: 'N° Voiture', dataIndex: 'group_car_number', key: 'group_car_number' },
        { title: 'Nature groupe', dataIndex: 'group_type', key: 'group_type' },
        { title: 'Prestation', dataIndex: 'group_prestation', key: 'group_prestation' },
        { title: 'Point RV', dataIndex: 'group_meeting_point', key: 'group_meeting_point' },
        { title: 'Heure RV', dataIndex: 'group_meeting_time', key: 'group_meeting_time' },
        { title: 'Responsable JDD', dataIndex: 'group_responsable_departure_day', key: 'group_responsable_departure_day' },
        { title: 'Tel. responsable JDD', dataIndex: 'group_responsable_phone_departure_day', key: 'group_responsable_phone_departure_day' },
        { title: 'Bus (nbre)', dataIndex: 'group_bus_number', key: 'group_bus_number' },
        { title: 'Responsable', dataIndex: 'group_responsable', key: 'group_responsable' },
        { title: 'Tel. responsable', dataIndex: 'group_responsable_phone', key: 'group_responsable_phone' },
        { title: 'Nom vendeur', dataIndex: 'group_seller_name', key: 'group_seller_name' },
        { title: 'Tel. vendeur', dataIndex: 'group_seller_phone', key: 'group_seller_phone' },
        { title: 'DPX (1 par train sensible)', dataIndex: 'group_dpx', key: 'group_dpx' },
        { title: 'Commentaires', dataIndex: 'group_comment', key: 'group_comment' },
    ];

    return (
        <Container>
            <div>
                <Header>
                    <HeaderTitle>Suivi des groupes autonomes</HeaderTitle>
                    <div>
                        <FileInputLabel htmlFor="inputFile">
                            <BiImport style={{ marginRight: '5px', fontSize: '18px' }} />
                            Importer les groupes de saison
                            <FileInput type="file" id='inputFile' onChange={importExcel} />
                        </FileInputLabel>
                    </div>
                </Header>
                <ListGroups>
                    <NestedTableTrains columns={trainColumns} expandedColumns={expandedColumns} data={data} />
                </ListGroups>
            </div>
        </Container>
    );
};

const Header = styled.div`
    background-color: #FFFFFF;
    border-bottom: 1px solid #d1d1d1;
    padding: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const HeaderTitle = styled.h1`
    margin: 0;
    margin-left: 15px;
    color: #3c3c3c;
    font-weight: bold;
`;

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.label`
    &:hover {
        background-color: #fbe2eb;
    }
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    background-color: #ffeff5;
    color: #fd95b7;
    padding: 10px;
    display: flex;
    font-size: 15px;
    flex-direction: row;
    align-items: center;
`;

const ListGroups = styled.div`
    width: auto;
    padding: 40px;
`;

export default IndependentGroups;