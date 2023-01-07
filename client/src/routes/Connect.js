import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import Header from "../general/header";
import { useNavigate } from 'react-router-dom'
import Content from "../general/content";

function Connect(){
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    const navigate = useNavigate();

    const [users, setUsers] = useState();
    
    useEffect(() => {

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

    const handleClick = (id) => {
        navigate('/strangerpage', {
            state: {
              userId: id,
            }
          });
    }



    return (
        <>
        <Header></Header>
        <Content>

        { users &&
            <>
            <div className="card" style={{width:'90%'}}> 
                <div className="card-body"> 
                    <div className="users">
                        {users.map((user, index) => {
                            return (
                                <div
                                    key={user.id}
                                    className="user"
                                    onClick={() => handleClick(user.id)}
                                >
                                    <div className="avatar">
                                        <img
                                        src={user.avatar_image}
                                        alt="avatar"
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{user.username}</h3>
                                    </div>

                                    <div className="biography">
                                        <h3>{user.biography}</h3>
                                    </div>

                                    <div className="native_l">
                                        <h3>{user.native_l}</h3>
                                    </div>

                                    <div className="new_l">
                                        <h3>{user.new_l}</h3>
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