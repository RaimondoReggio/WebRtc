import React, { useEffect } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const WaitingRoom = () => {
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        alreadyReagister();
    }, []);

    // Check if user sign up or sign is the first time
    const alreadyReagister = async() => {
        const token = await getAccessTokenSilently();

        await Axios.get("http://localhost:4000/checkIfUserExist", {
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
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default WaitingRoom;