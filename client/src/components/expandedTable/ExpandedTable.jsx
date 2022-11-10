import React from 'react';
import { Table } from "antd";

const ExpandedTable = ({
    groups,
    expandedColumns
}) => {
    const renderGroupData = groups.map((obj, index) => ({ 
        key: index, 
        ...obj
    }));

    return <Table
    scroll={{ x: 1000 }}
    bordered
    columns={expandedColumns} 
    dataSource={renderGroupData} 
    pagination={false}
    />;
};

export default ExpandedTable;