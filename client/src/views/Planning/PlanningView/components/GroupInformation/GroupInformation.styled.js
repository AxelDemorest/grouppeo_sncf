import styled from "styled-components";

export const GroupWrapper = styled.div`
    width: 90%;
    height: auto;
    margin: 0 0 20px 0;
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px 0;
`;

export const ButtonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin-top: 15px;
    width: 90%;
    background-color: #4d8ff6;
    border: 1px solid #2e71d7;
    padding: 5px 0;
    border-radius: 5px;
    color: #fff;
  }
`;
