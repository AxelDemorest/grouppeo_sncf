import React from 'react';
import styled from 'styled-components';
import { Table } from "antd";

const NestedTableTrains = (props) => {

    const renderData = props.data.map((obj, index) => ({ key: index, ...obj }))

    const expandedRowRender = (group) => {
        return <Table 
        scroll={{ x: 1000 }}
        columns={props.expandedColumns} 
        dataSource={group} 
        pagination={false} 
        />;
    };

    return (
        <NestedTable 
        scroll={{ y: 480 }}
        columns={props.columns} 
        expandable={{
            expandedRowRender: train => expandedRowRender(train.train_groups),
        }} 
        dataSource={renderData}
        />
    );
};

const NestedTable = styled(Table)`
    margin: 0;
`;

export default NestedTableTrains;