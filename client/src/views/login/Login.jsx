import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Alert from '@mui/material/Alert';
import FormInput from '../../components/formInput/FormInput';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { dispatch } = useContext(AuthContext)
    const [isError, setIsError] = useState(false);
    const [values, setValues] = useState({
        user_email: '',
        user_password: ''
    });

    const inputs = [
        {
            id: 1,
            type: 'text',
            name: 'user_email',
            placeholder: 'Votre email',
            required: true,
            label: 'Identifiant',
        },
        {
            id: 2,
            type: 'password',
            name: 'user_password',
            placeholder: 'Votre mot de passe',
            required: true,
            label: 'Mot de passe',
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await axios.post('http://localhost:3001/auth/login', values);
            dispatch({ type: "LOGIN_SUCCESS", payload: jwt_decode(user.data.access_token) });
            navigate(state?.path || "/", { replace: true });
        } catch(err) {
            setIsError(true)
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        }
    }

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <LoginContainer>
            <Side>
                <BackgroundLogin></BackgroundLogin>
            </Side>
            <Side>
                <FormContainer>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Connexion</FormTitle>
                        <FormDescription>Indiquez vos informations de connexions ci-dessous.</FormDescription>
                        <FormGroup>
                            {isError && <Alert severity="error" style={{ marginBottom: '15px' }}>Email ou mot de passe incorrect !</Alert>}
                            {inputs.map((input) => (
                                <FormInput
                                    with="100%"
                                    key={input.id}
                                    {...input}
                                    value={values[input.name]}
                                    onChange={onChange}
                                />
                            ))}
                            <Button type="submit">Connexion</Button>
                        </FormGroup>
                    </Form>
                </FormContainer>
            </Side>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const Side = styled.div`
    height: 100vh;
    width: 50%;
`;

const BackgroundLogin = styled.div`
    height: 100%;
    width: 100%;
    background: center/cover no-repeat url('img/banner_login.jpg');
`;

const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 70%;
`;

const FormTitle = styled.h1`
    font-size: 40px;
    margin-bottom: 0;
`;

const FormDescription = styled.p`
    margin-bottom: 50px;
`;

const FormGroup = styled.div`
    width: 100%;
    padding-bottom: 100px;
`;

const Button = styled.button`
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

export default Login;