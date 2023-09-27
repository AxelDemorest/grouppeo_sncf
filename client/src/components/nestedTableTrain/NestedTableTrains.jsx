import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { Table } from "antd";
import ExpandedTable from "../expandedTable/ExpandedTable";

const NestedTableTrains = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        let filteringData;

        if (props.inputText && props.inputText !== '') {
            const filteringByTrainNumber = props.data.filter(obj => obj.train_number.startsWith(props.inputText));
            const filteringByGroupName = props.data.filter(train => train.train_groups.some(group => group.group_name?.toLowerCase().startsWith(props.inputText)))
                .map(train => ({
                    ...train,
                    train_groups: train.train_groups.filter(group => group.group_name?.toLowerCase().startsWith(props.inputText))
                }))
            if (filteringByTrainNumber.length > 0) filteringData = filteringByTrainNumber;
            else filteringData = filteringByGroupName;
        } else {
            filteringData = props.data;
        }

        const map = filteringData.map((obj, index) => ({
                key: index,
                ...obj,
                train_date: obj.train_date,
                train_hour: obj.train_hour,
            }));

        setData(map);
    }, [props.data, props.inputText])

  return (
      <NestedTable
          scroll={{ y: 920, x: 920 }}
          key={data.length}
          columns={props.columns}
          expandable={{
              expandedRowRender: (train) => (
                  <ExpandedTable
                      groups={train.train_groups}
                      expandedColumns={props.expandedColumns}
                  />
              ),
              defaultExpandAllRows: true,
          }}
          pagination={false}
          dataSource={data}
      />
  );
};

const NestedTable = styled(Table)`
  margin-top: 10px;
  border-top: 1px solid #ececec;
`;

export default NestedTableTrains;
