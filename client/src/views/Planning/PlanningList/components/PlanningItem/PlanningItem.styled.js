import styled from "styled-components";
import {Button} from "antd";
import {Link} from "react-router-dom";

export const Container = styled(Link)`
    width: 100%;
    background-color: #fff;
    border: 1px solid lightgray;
    padding: 30px;
    cursor: pointer;
    border-radius: 10px;
    margin-bottom: 20px;
    transition: all 0.3s ease-in-out;
    color: black;
  
  &:hover {
    margin-left: 10px;
    color: black;
  }
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
  
  p {
    margin: 0 10px 0 0;
    font-size: 19px;
    font-weight: 500;
  }
`;

export const Statistics = styled.div`
  margin: 10px 0 20px 0;
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
    height: 0.5px;
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