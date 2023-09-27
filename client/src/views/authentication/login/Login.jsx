import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Alert from '@mui/material/Alert';
import FormInput from '../../../components/formInput/FormInput';
import { AuthContext } from '../../../context/AuthContext';
import * as styled from "../authentication.styled";
import {checkCredentials} from "../../../api/services/authServices";

const Login = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { dispatch } = useContext(AuthContext);

    const [isError, setIsError] = useState(false);
    const [values, setValues] = useState({
        user_email: '',
        user_password: ''
    });

    const inputs = [
        { id: 1, type: 'text', name: 'user_email', placeholder: 'Votre email', required: true, label: 'Identifiant' },
        { id: 2, type: 'password', name: 'user_password', placeholder: 'Votre mot de passe', required: true, label: 'Mot de passe' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await checkCredentials(values);
            const user = jwt_decode(response.data?.access_token);

            const type = user.confirmed ? "LOGIN_SUCCESS" : "LOGIN_PENDING";
            dispatch({ type, payload: response.data?.access_token });

            if (user.confirmed) {
                navigate(state?.path || "/", { replace: true });
            } else {
                navigate('/change-password');
            }

        } catch (err) {
            setIsError(true);
            dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data });
        }
    }

    return (
        <styled.LoginContainer>
            <styled.Side>
                <styled.BackgroundLogin />
            </styled.Side>
            <styled.Side>
                <styled.FormContainer>
                    <styled.Form onSubmit={handleSubmit}>
                        <styled.FormTitle>Connexion</styled.FormTitle>
                        <styled.FormDescription>Indiquez vos informations de connexions ci-dessous.</styled.FormDescription>
                        <styled.FormGroup>
                            {isError && <Alert severity="error" style={{ marginBottom: '15px' }}>Email ou mot de passe incorrect !</Alert>}
                            <>
                                {inputs.map((input) => (
                                    <FormInput
                                        with="100%"
                                        key={input.id}
                                        {...input}
                                        value={values[input.name]}
                                        onChange={e => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                    />
                                ))}
                            </>
                            <styled.Button type="submit">Connexion</styled.Button>
                        </styled.FormGroup>
                    </styled.Form>
                </styled.FormContainer>
            </styled.Side>
        </styled.LoginContainer>
    );
};

export default Login;
