import styled from "styled-components";
import {Select} from "antd";

export const PlanningContainer = styled.div`
  width: 25%;
  height: auto;
  margin: 25px 40px 0 40px;
  border-radius: 10px;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;

export const CustomSelect = styled(Select)`
  width: 250px;
  margin-bottom: 10px;
  @media (max-width: 992px) {
    width: 20%;
    margin-right: 20px;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 40px 40px 40px;
`;