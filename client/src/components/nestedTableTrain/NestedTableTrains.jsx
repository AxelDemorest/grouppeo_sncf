import React from "react";
import styled from "styled-components";
import { Table } from "antd";
import ExpandedTable from "../expandedTable/ExpandedTable";

const NestedTableTrains = (props) => {
  const renderData = props.data.map((obj, index) => ({
    key: index,
    ...obj,
    train_date: obj.train_date?.split(" ")[0],
    train_hour: obj.train_hour?.split(" ")[1],
  }));

  return (
    <NestedTable
      bordered
      scroll={{ y: 920 }} // mac : 500 // pc : 920
      columns={props.columns}
      expandable={{
        expandedRowRender: (train) => (
          <ExpandedTable
            groups={train.train_groups}
            expandedColumns={props.expandedColumns}
          />
        ),
      }}
      pagination={{ pageSize: 20 }}
      dataSource={renderData}
    />
  );
};

const NestedTable = styled(Table)`
  margin: 0;
`;

export default NestedTableTrains;
