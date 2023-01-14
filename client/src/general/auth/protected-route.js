import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// Utilizzata per verificare se l'utente ha eseguito il login(Auth0).

const ProtectedRoutes = ({children}) => {
    const { isAuthenticated } = useAuth0();
    if(!isAuthenticated) {
        return <Navigate to="/" replace/>
    }
    return children;
};

export default ProtectedRoutes;