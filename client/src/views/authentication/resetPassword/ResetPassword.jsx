import React, { useContext, useState } from 'react';
import FormInput from "../../../components/formInput/FormInput";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import * as styled from "../authentication.styled";
import { AuthContext } from "../../../context/AuthContext";
import { changePassword } from "../../../api/services/userServices";
import { checkCredentials } from "../../../api/services/authServices";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token, dispatch } = useContext(AuthContext);
    const [password, setPassword] = useState('');
    const { sub: userId, email } = jwt_decode(token);

    const handleSubmitPasswordChange = async (event) => {
        event.preventDefault();

        try {
            await changePassword(userId, password);
            const response = await checkCredentials({ user_email: email, user_password: password });

            if (response?.data?.access_token) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.access_token });
                navigate("/");
            } else {
                console.error("Token is missing from the response.");
            }

        } catch (err) {
            console.error("Error changing password:", err);
        }
    };

    return (
        <styled.LoginContainer>
            <styled.Side>
                <styled.BackgroundLogin />
            </styled.Side>
            <styled.Side>
                <styled.FormContainer>
                    <styled.Form onSubmit={handleSubmitPasswordChange}>
                        <styled.FormTitle>Changez votre mot de passe</styled.FormTitle>
                        <styled.FormDescription>
                            Afin d'accéder au panel d'administration, changez votre mot de passe.
                        </styled.FormDescription>
                        <styled.FormGroup>
                            <FormInput
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nouveau mot de passe"
                                required
                            />
                            <styled.Button type="submit">Connexion</styled.Button>
                        </styled.FormGroup>
                    </styled.Form>
                </styled.FormContainer>
            </styled.Side>
        </styled.LoginContainer>
    );
};

export default ResetPassword;
