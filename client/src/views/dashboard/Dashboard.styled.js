import styled from "styled-components";

export const BodyStatContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

export const Side = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

export const Box = styled.div`
  height: 200px;
  width: 48%;
  margin-bottom: 40px;
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: 30px;
    font-weight: bold;
    margin: 0;
  }
  
  p {
    font-size: 20px;
  }
`;

export const BoxHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  padding-left: 30px;
  
  p {
    margin: 0;
  }
`;

export const BoxBody = styled.div`
  padding-left: 30px;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;

  p {
    font-size: 40px;
    display: inline-block;
    margin: 0;
  }

  span {
    margin-left: 14px;
    background-color: #eaeaea;
    border: 1px solid #c3c3c3;
    padding: 3px 6px;
    font-size: 13px;
    color: #4c4c4c;
    border-radius: 3px;
  }
`;

export const GraphicBox = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  border-radius: 10px;
  padding: 30px 50px;
`;

export const HeaderGraphicBox = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 99%;
  margin-bottom: 5px;
  
  h2 {
    font-size: 25px;
    font-weight: bold;
  }
`;

export const WrapperIcon = styled.div`
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-right: 20px;
  background-color: ${({color}) => color};
  border: ${({border}) => border};
`;

export const News = styled.div`
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  border-radius: 5px;
  width: 100%;
  background-color: #fff;
  margin-top: 40px;
  padding: 30px;
  
  h2 {
    font-weight: bold;
  }
`;

export const UpdateItem = styled.div`
  border-left: 3px solid #ed5663;
  padding-left: 10px;
  padding-top: 5px;
  margin: 20px 0 30px 0;
  
  p {
    line-height: 1.5;
    font-size: 17px;
  }
`;

export const Banner = styled.div`
  background-color: #3b405d;
  height: 250px;
`;

export const Content = styled.div`
  margin-top: -150px;
  margin-bottom: 50px;
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f8fd;
  border-radius: 10px;
  border: 1px solid #cecece;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  padding: 45px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
