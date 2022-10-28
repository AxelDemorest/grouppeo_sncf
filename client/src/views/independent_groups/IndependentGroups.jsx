import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { utils, read } from 'xlsx';
import Container from '../../components/container/Container';

const EXTENSIONS = ['xlsx', 'csv', 'xls']

const IndependentGroups = () => {
    const [data, setData] = useState();
    const [trains, setTrains] = useState();

    useEffect(() => {
        const createTrains = async () => {
            const trainRequest = await axios.post('http://localhost:3001/train/train', data);
            console.log(trainRequest.data);
        };

        if(data) {
            createTrains();
        }
    }, [data, trains]);

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
        console.log(rows);
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
            // console.log(fileData);
            const headers = fileData[0];
            /*const headersReplace = [
                'date', 
                'heure', 
                'no_train', 
                'destination',
                'nom_groupe',
                'total_voyageurs',
                'no_voiture',
                'type_groupe',
                'prestation',
                'point_rdv',
                'heure_rdv',
                'resp_jour_depart',
                'tel_resp_jour_depart',
                'bus_nombre',
                'responsable',
                'responsable_tel',
                'nom_vendeur',
                'tel_vendeur',
                'dpx',
                'commentaire'
            ];*/
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

    const headTable = [
        'Dates', 
        'Heures', 
        'No de train', 
        'Destination', 
        'Nom groupe' , 
        'Nbre place', 
        'No de voiture', 
        'Nature groupe',
    ];

    return (
        <Container>
            <div>
                <Header>
                    <HeaderTitle>Suivi des groupes autonomes</HeaderTitle>
                </Header>
                <input type="file" onChange={importExcel} />
                <ListGroups>
                    <CustomTable>
                        <thead>
                            <tr>
                                <th>
                                    
                                </th>
                            </tr>
                        </thead>
                    </CustomTable>
                </ListGroups>
            </div>
        </Container>
    );
};

const Header = styled.div`
    background-color: #FFFFFF;
    border-bottom: 1px solid #d1d1d1;
`;

const HeaderTitle = styled.h1`
    margin: 0;
    padding: 30px;
    margin-left: 15px;
    color: #3c3c3c;
`;

const ListGroups = styled.div`
`;

const CustomTable = styled.table`
`;

export default IndependentGroups;