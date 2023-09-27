import styled, { css } from "styled-components";
import {Button, Table, Input} from "antd";

export const Steps = styled.div`
    width: 15%;
    padding: 20px;
    border-right: 1px solid #e8e8e8;
    background-color: #fff;
    height: 100%;
  
  h3 {
    font-weight: bold;
    margin: 0 0 20px 5px;
  }
`;

export const StepCard = styled.div`
  width: 100%;
  background-color: #F0FCF6;
  border-radius: 10px;
  border: 1px solid #C9EAE2;
  padding: 20px 15px;
  margin-bottom: 25px;
`;

export const StepCardInWaiting = styled.div`
  width: 100%;
  background-color: #FAFBFC;
  border-radius: 10px;
  border: 1px solid #d5e1ef;
  padding: 20px 15px;
  margin-bottom: 25px;
`;

export const StepCardTitle = styled.p`
  color: #bbbbbb;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 0;
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;

export const IconSuccess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6bdc9c;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;

export const StepCardDescription = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

export const StepCardTag = styled.span`
    background-color: #e8f0fe;
    color: #3f6ad8;
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 600;
    display: inline-block;
    margin-top: 7px;
    margin-right: 10px;
`;

export const StepCardTagSuccess = styled.span`
    background-color: #6bdc9c;
    color: #FFF;
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 600;
    display: inline-block;
    margin-top: 7px;
`;

export const ListGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
`;

export const ListGroups = styled.div`
  width: 90%;
  margin: 20px 0 40px 40px;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;

const greenCell = css`
    background-color: #c1f1d8;
`;

const redCell = css`
  background-color: #f1c1c1;
`;

const normalCell = css`
    background-color: white;
`;

const CustomTable = styled(Table)`
  .ant-table-thead > tr > th {
    height: 5px;
    padding: 4px;
  }
`;

export const Cell = styled.div`
  ${(props) => props.isFinished ? greenCell : props.isWaiting ? redCell : normalCell}
  width: 100%;
  height: 100%;
`;

export const Train = styled.div`
  width: 100%;
  margin-right: 0;
  background-color: #fff;
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  margin-bottom: 25px;
  overflow-x: scroll;
`;

export const TrainNumber = styled.p`
  font-weight: bold;
  padding: 8px;
  font-size: 15px;
  margin: 20px 0 10px 20px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
`;

export const InputTrainTrack = styled(Input)`
  font-weight: bold;
  padding: 8px;
  width: 60px;
  font-size: 15px;
  margin: 20px 0 10px 20px;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
`;

export const CustomHeaderButton = styled(Button)`
    margin-right: 20px;
`;

export const Label = styled.p`
    font-weight: bold;
`;

export const GroupValue = styled.p`
  margin-bottom: 20px;
  border: 1px solid lightgray;
  padding: 8px 0 8px 8px;
  border-radius: 5px;
  cursor: pointer;
`;
