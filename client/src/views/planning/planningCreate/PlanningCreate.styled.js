import styled from "styled-components";
import {Button} from "antd";

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #F8FBFC;
    display: flex;
    padding: 40px;
    justify-content: center;
`;

export const Close = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 80px;
  height: 40px;
  background: #fff;
  border-radius: 5px;
  border: 1px solid lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;


export const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 55%;
`;

export const Logo = styled.img`
    margin: 30px 0 20px 0;
    border-radius: 8px;
`;

export const Title = styled.h1`
    font-size: 30px;
    font-weight: 700;
`;

export const Description = styled.p`
    font-size: 17px;
    width: 80%;
    text-align: center;
    margin-bottom: 80px;
`;

export const StepList = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

export const StepContainer = styled.div`
    width: 22%;
`;

export const StepNumber = styled.div`
  text-transform: uppercase;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ status, current }) => {
    if (current) {
      return '#1890ff';
    } else if (status === 'finish') {
      return '#3bbd8b';
    } else {
      return '#747b86';
    }
  }};
`;

export const StepName = styled.div`
  font-weight: 600;
  color: #5e6269;
  font-size: 16px;
`;

export const StepBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  margin-bottom: 15px;
  background-color: ${({ status, current }) => {
    if (current) {
      return '#1890ff';
    } else if (status === 'finish') {
      return '#3bbd8b';
    } else {
      return '#d9d9d9';
    }
  }};
`;

export const GenerateContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 35px;
    background-color: #fff;
    border-radius: 8px;
    width: ${props => props.width ? props.width : '100%'} ;
    box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
`;

export const GenerateTitle = styled.p`
    font-size: 18px;
    font-weight: 600;
    margin: 15px 20px;
`;

export const Header = styled.div`
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
`;

export const ShortDescription = styled.p`
  color: #848484;
  //margin-bottom: 20px;
  font-size: 14px;
  padding: ${props => props.padding ? props.padding : '0'};
`;

export const CustomButton = styled(Button)`
  background-color: #151d3f;
  color: #fff;
  margin: 0 20px 20px 20px;
  
  &:hover {
    color: #fff !important;
    border: 1px solid #fff !important;
  }
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

export const Form = styled.form`
  padding: 30px;
`;
