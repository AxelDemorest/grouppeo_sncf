import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #F8FBFC;
    display: flex;
    justify-content: center;
`;

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
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
    width: 80%;
`;

export const StepContainer = styled.div`
    width: 25%;
`;

export const StepNumber = styled.div`
  text-transform: uppercase;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 6px;
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
