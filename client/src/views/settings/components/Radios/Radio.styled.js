import styled from "styled-components";
import {Table} from "antd";

export const Wrapper = styled.div`
  margin-top: 10px;
`;

export const AddRadio = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
`;

export const AddRadioForm = styled.form`
  margin: 20px 0;
  width: 40%;
`;

export const AddRadioFormInput = styled.input`
    width: 200px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: block;
    margin-bottom: 15px;
`;

export const AddRadioDescription = styled.p`
  color: #999;
  font-size: 12px;
`;

export const SubmitRadioButton = styled.button`
    background-color: #151d3f;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

export const CustomTable = styled(Table)`
  width: 40%;
`;
