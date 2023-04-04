import React from 'react';
import {HiMenuAlt3} from "react-icons/hi";
import styled from "styled-components";

const Header = ({ title }) => {
    return (
        <div>
            <Container>
                <Wrapper>
                    <div>
                        <HiMenuAlt3 size={35} color={'#151d3f'} />
                        <Title>{title}</Title>
                    </div>
                </Wrapper>
            </Container>
        </div>
    );
};

const Container = styled.div`
  height: 100px;
  background-color: #fff;
  border-bottom: 1.5px solid #eaeaea;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 70px;
  
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const Title = styled.h1`
  margin: 0 0 0 15px;
  font-weight: bold;
  font-size: 30px;
`;

export default Header;
