import React, { useEffect } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// Utilizzato per verificare se l'utente ha completato la registrazione dei dati profilo(Mongo)
// viene utilizzato una sola volta dopo il login su Auth0. 
const WaitingRoom = () => {
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        alreadyReagister();
    }, []);

    // Controlla se l'utente è già registrato tramite API.
    const alreadyReagister = async() => {
        const token = await getAccessTokenSilently();

        await Axios.get(BASE_URL + "/checkIfUserExist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if(response.data.isRegistered) {
                navigate('/userpage');
            } else {
                navigate('/register');
            }
        })
    };

    return (
        <div className="loading-container row align-items-center justify-content-center" style={{height: '100vh'}}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default WaitingRoom;