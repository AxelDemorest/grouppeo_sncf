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
  margin: 20px 40px 40px 40px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 20px;
`;

export const PlanningList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Month = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  cursor: pointer;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
    font-size: 20px;
  }
`;

export const BorderMonth = styled.div`
  width: 2px;
  height: 90%;
  background-color: #709db0;
  margin-right: 7px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #FCFBFC;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 30px;
`;

export const Accordion = styled.div`
  font-size: 20px;
  margin-left: 5px;
`;
