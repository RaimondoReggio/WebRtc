import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../general/header";
import { useNavigate } from 'react-router-dom'
import Content from "../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import england_flag from '../assets/flags/england.png';
import spain_flag from '../assets/flags/spain.png';
import italy_flag from '../assets/flags/italy.png';
import sweden_flag from '../assets/flags/sweden.png';

// Componente utilizzato per visualizzare gli utenti da conoscere
// gli utenti compatibili sono selezionati in base alla corrispondeza di lingue

function Connect(){
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    const navigate = useNavigate();

    const [users, setUsers] = useState();
    
    useEffect(() => {

        // Preleva tramite API la lista di possibli nuovi contatti
        const getPossibleUsers = async() => {
            const token = await getAccessTokenSilently();
            await Axios.get(BASE_URL+'/getPossibleUsers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if(response.data){
                    setUsers(response.data);
                }
                
            });
        };

        getPossibleUsers();

    }, []);

    // Redirect alla pagine profilo di un altro utente
    const handleClick = (id) => {
        navigate('/strangerpage', {
            state: {
              userId: id,
            }
        });
    }

    const flags_array = {
        italian: italy_flag,
        spanish: spain_flag,
        swedish: sweden_flag,
        english: england_flag,
    }

    return (
        <>
        <Header currentSelection={1}></Header>
        <Content>

        { users &&
            <>
            <div className="connect-container d-flex justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="connect-content">
                    <div className="users row">
                        {users.map((user, index) => {
                            return (
                                <div className="col-md-4" key={index}>
                                    <div className="card card-user">
                                        <div className="card-body">
                                            <div className="flag-image">
                                                <img src={flags_array[user.native_l]} />
                                            </div>
                                            <div
                                                key={user.id}
                                                className="user"
                                                onClick={() => handleClick(user.id)}
                                            >
                                                <div className="row">
                                                    <div className="col-md-5 d-flex justify-content-center">
                                                        <div className="avatar">
                                                            <img
                                                            src={user.avatar_image}
                                                            alt="avatar"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7 d-flex align-items-center justify-content-left">
                                                        <div className="info-content">
                                                            <div className="username">
                                                                <h4>{user.username}</h4>
                                                            </div>
                                                            <div className="language">
                                                                <div className="native_l">
                                                                    <p>{user.native_l}</p>
                                                                </div>
                                                                <div className="arrow-container d-flex justify-content-center" style={{width: '58px'}}>
                                                                    <div className="arrow">
                                                                        <div className="arrow-right">
                                                                            <FontAwesomeIcon icon={faArrowRight} />
                                                                        </div>
                                                                        <div className="arrow-left">
                                                                            <FontAwesomeIcon icon={faArrowLeft} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="new_l">
                                                                    <p>{user.new_l}</p>
                                                                </div>
                                                            </div>
                                                            <div className="biography">
                                                                <p>{user.biography}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            </>
        }
        </Content>
        </>
        
    );




}

export default Connect;