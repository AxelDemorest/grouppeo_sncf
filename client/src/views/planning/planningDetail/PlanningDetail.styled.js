import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const UserDetails = styled.div`
  height: auto;
  margin: 25px 40px 40px 0px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  width: 13%;
  
  h2 {
    margin-bottom: 30px;
  }
`;

export const Information = styled.div`
  padding: 20px 40px;
  border: 1px solid #eaeaea;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  p {
    margin-bottom: 0;
  }
`;

export const Details = styled.div`
  height: auto;
  margin: 25px 40px 40px 40px;
  padding: 30px 30px 15px 30px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  border-radius: 10px;
  background-color: #fff;
  width: 85%;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;

export const AgentButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 3px 7px;
  cursor: pointer;
`;
