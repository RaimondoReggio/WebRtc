import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoutes = ({children}) => {
    const { isAuthenticated } = useAuth0();
    if(!isAuthenticated) {
        return <Navigate to="/" replace/>
    }
    return children;
};

export default ProtectedRoutes;