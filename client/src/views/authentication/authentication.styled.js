import styled from "styled-components";

export const LoginContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Side = styled.div`
    height: 100vh;
    width: 50%;
`;

export const BackgroundLogin = styled.div`
    height: 100%;
    width: 100%;
    background: center/cover no-repeat url('img/banner_login.jpg');
`;

export const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 70%;
`;

export const FormTitle = styled.h1`
    font-size: 40px;
    margin-bottom: 0;
`;

export const FormDescription = styled.p`
    margin-bottom: 50px;
`;

export const FormGroup = styled.div`
    width: 100%;
    padding-bottom: 100px;
`;

export const Button = styled.button`
    &:hover {
        background-color: #d695ac;
    }
    cursor: pointer;
    width: 30%;
    background-color: #e9a9bf;
    font-weight: 700;
    font-size: 15px;
    border: none;
    padding: 13px 0;
    color: white;
    border-radius: 5px;
`;
