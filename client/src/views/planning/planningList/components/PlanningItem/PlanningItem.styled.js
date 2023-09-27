import styled from "styled-components";
import {Button} from "antd";

export const Container = styled.div`
  width: 45%;
  background-color: #fdfdfd;
  border: 1px solid lightgray;
  padding: 10px 0;
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 20px;
  margin-right: 50px;
  color: black;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  text-decoration: none;

  &:hover {
    color: black;
    background-color: #f7f8fb;
  }
`;

export const Date = styled.div`
  width: 8%;
  border-right: 1px solid lightgray;
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DayNumber = styled.p`
  font-size: 3rem;
  margin-bottom: 0;
  height: 60px;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  padding-right: 35px;
`;

export const Square = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: #175FF2;
  margin-right: 10px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 3px;
  
  p {
    margin: 0 10px 0 0;
    font-size: 19px;
    font-weight: 500;
  }
`;

export const Statistics = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  p {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: gray;
    font-size: 16px;
    margin: 0 15px 0 0;
    color: #4D5562;
  }
`;

export const CustomButton = styled(Button)`
    margin-left: 20px;
`;

export const Tag = styled.span`
    background-color: #F1FAF5;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    color: black;
    border: 1px solid #A3CAB7;
    border-radius: 7px;
`;

export const BorderSeparator = styled.hr`
    height: 80%;
    width: 1.5px;
    background-color: lightgray;
    border: none;
`;

export const FooterItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
`;

export const Steptag = styled.p`
    border: 1px solid lightgray;
    border-radius: 20px;
    color: black;
    font-size: 16px;
    padding: 5px 15px;
    margin: 0;
`;
