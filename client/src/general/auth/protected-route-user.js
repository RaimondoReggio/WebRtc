import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Axios from 'axios';

const ProtectedRoutesUser = ({children}) => {
    const { isAuthenticated } = useAuth0();
    const {getAccessTokenSilently} = useAuth0();
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    // Check if user is already registered
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