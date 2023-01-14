import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Axios from 'axios';

// Utilizzata per verificare se l'utente ha eseguito il login(Auth0) e 
// terminato la procedura di registrazione dei dati profilo(Mongo).

const ProtectedRoutesUser = ({children}) => {
    const { isAuthenticated } = useAuth0();
    const {getAccessTokenSilently} = useAuth0();
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    // Controlla se l'utente è presente nel db(Mongo).
    const checkIfUserExist = async() => {
        const token = await getAccessTokenSilently();

        await Axios.get(BASE_URL + "/checkIfUserExist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if(response.data.isRegistered) {
                return true;
            } else {
                return false;
            }
        })
    }

    if(isAuthenticated) {
        if(!checkIfUserExist) {
            return <Navigate to="/register" replace/>
        }
    } else {
        return <Navigate to="/" replace/>
    }

    return children;
};

export default ProtectedRoutesUser;