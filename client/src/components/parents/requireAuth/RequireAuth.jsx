import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import jwt_decode from "jwt-decode";

const RequireAuth = ({ children }) => {
    const { token } = useContext(AuthContext);
    const location = useLocation();
    let isAuthenticated = false;

    if (token && token !== "" && token !== "null") {
        const decodedToken = jwt_decode(token);
        isAuthenticated = decodedToken?.exp > new Date().getTime() / 1000;
    }

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to='/connexion' replace state={{ path: location.pathname }} />
    )
};

export default RequireAuth;
