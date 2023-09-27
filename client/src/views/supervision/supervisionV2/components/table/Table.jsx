import React, {useState} from 'react';
import styled from 'styled-components';
import {Button, Tag} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined} from "@ant-design/icons";
import axios from "axios";

const renderStatus = (statusName, item) => {
    const statusFound = item?.groupStatus.find(findStatus => findStatus?.status?.name === statusName);
    if (statusFound) {
        return (
            <Tag icon={<CheckCircleOutlined />} color="success">
                Terminé
            </Tag>
        );
    } else {
        return (
            <Tag icon={<ClockCircleOutlined />} color="processing">
                En attente
            </Tag>
        );
    }
}

const Table = ({ data, setCurrentGroup }) => {
    const headers = [
        { name: 'Actions' },
        { name: 'Renfort' },
        { name: 'Groupe arrivé' },
        { name: 'Groupe installé' },
        { name: 'TM débutée' },
        { name: 'TM terminée' },
        { name: 'Heure RV' },
        { name: 'Destination' },
        { name: 'Nom groupe' },
        { name: 'Total voyageurs' },
        { name: 'N° Voiture' },
        { name: 'Prestation' },
        { name: 'Point RV' },
        { name: 'Responsable JDD' },
        { name: 'Tel. responsable JDD' },
    ]

    return (
        <StyledTable>
            <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header.name}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data?.map((item, index) => (
                <CustomTR tm={item.group_prestation} key={index}>
                    <td>
                        <Button
                            style={{ marginRight: '10px' }}
                            onClick={() => setCurrentGroup(item)}
                        >
                            Étapes
                        </Button>
                    </td>
                    <td><Tag color="default">Renfort {item?.group_planning?.agentNumber || ''} - {item?.radioInfo?.number || ''} </Tag></td>
                    <td>{renderStatus('Groupe arrivé', item)}</td>
                    <td>{renderStatus('Groupe installé', item)}</td>
                    {item.group_prestation ? (
                            <>
                                <td>{renderStatus('TM débutée', item)}</td>
                                <td>{renderStatus('TM terminée', item)}</td>
                            </>
                        ) :
                        <>
                            <td>/</td>
                            <td>/</td>
                        </>
                    }
                    <td>{item.group_meeting_time}</td>
                    <td>{item.group_destination}</td>
                    <td>{item.group_name}</td>
                    <td>{item.group_total_travellers}</td>
                    <td>{item.group_car_number}</td>
                    <td>{item.group_prestation ? <Tag color="gold">BAGTM</Tag> : ''}</td>
                    <td>{item.group_meeting_point}</td>
                    <td>{item.group_responsable_departure_day}</td>
                    <td>{item.group_responsable_phone_departure_day}</td>
                </CustomTR>
            ))}
            </tbody>
        </StyledTable>
    );
};

const StyledTable = styled.table`
  font-family: 'AvenirBook', sans-serif;
  background-color: white;
  border-collapse: collapse;
  width: 100%;
  margin: 0;
  font-size: 14px;

  & thead {
    border-bottom: 1px solid #ececec;
    font-size: 14px;
  }

  & tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  & th {
    padding: 16px;
  }

  & th, & td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 16px;
    border-bottom: 1px solid #ececec;
  }

  & td {
    padding: 16px;
    color: black;
    text-align: center;
  }
`;

const CustomTR = styled.tr`
  background-color: ${props => props.tm ? 'rgba(252,229,143,0.42)' : ''} !important;
`;

export default Table;
