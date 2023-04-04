import styled from "styled-components";

export const StepsContainer = styled.div`
    width: 13%;
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
  width: 87%;
`;

export const ListGroups = styled.div`
  height: auto;
  width: auto;
  margin: 0 40px 40px 40px;
  @media (max-width: 992px) {
    width: 200%;
    margin: 0;
  }
`;
