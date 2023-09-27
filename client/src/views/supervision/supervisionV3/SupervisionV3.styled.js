import styled from "styled-components";

export const Radio = styled.div`
  width: 100%;
  height: auto;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  margin: 20px;
  border-radius: 10px;
  background-color: #fff;
  
  h3 {
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
`;

export const Train = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: #fff;
  border-left: 8px solid rgba(67, 111, 155, 0.61);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  margin: 20px;
  overflow-x: scroll;

  h3 {
    padding: 20px 0 0 20px;
  }
  
  button {
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    margin-top: 6px;
    margin-left: 2px;
    align-items: center;
  }

  &:nth-child(even) {
    border-left: 8px solid #efb7b7;
  }
`;

export const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #e8e8e8;
  background-color: #f6f6f6;
  padding: 10px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const Steps = styled.div`
  display: flex;
  justify-content: center;
`;

export const Step = styled.div`
  position: relative;
  background-color: #f1f7fd;
  display: flex;
  flex-direction: row;
  border: 1px solid #aac1ca;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px 30px;
  border-radius: 5px;
  width: 80%;

  .round-div {
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-color: #00AF55;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  
  .round-div-processing {
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-color: #aac1ca;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  p {
    margin-bottom: 0;
  }
  
  &:not(:last-child) {
    margin-right: 20px;
  }
`;

export const StepTitle = styled.span`
  margin-right: 10px;
`;

export const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 18%;
`;

export const RadioList = styled.div`
  padding: 20px 20px 20px 40px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const RadioItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  width: 48%;
`;

export const CircleIcon = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #d8d8d8;
  margin-right: 15px;
`;

export const Label = styled.p`
  font-weight: bold;
  margin-bottom: 7px;
`;

export const GroupValue = styled.p`
  margin-bottom: 0;
  color: #6d6c6c;
`;
