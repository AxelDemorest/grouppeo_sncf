import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RequireAuth = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const isAuthenticated = user?.exp > new Date().getTime() / 1000;
    return isAuthenticated ? (
        children
    ) : (
        <Navigate to='/connexion' replace state={{ path: location.pathname }} />
    )
};

export default RequireAuth;