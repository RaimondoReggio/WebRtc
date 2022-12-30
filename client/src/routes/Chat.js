import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';
import Content from "../general/content";
import Header from "../general/header";
import Contacts from "../partials/chat/contacts";
import ChatContainer from "../partials/chat/chat-container";

function Chat() {
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const socket = useRef();

    const {getAccessTokenSilently} = useAuth0();

    const [currentUser,setCurrentUser] = useState();
    const [contacts,setContacts]= useState([]);
    const [currentChat,setCurrentChat] = useState();

    // Execute getUserData on mounting
    useEffect(() => {

        // Check if user data are in local storage and retrive all data
        const getUserData = async() => {
            if(!localStorage.getItem("user-data")) {
                const token = await getAccessTokenSilently();

                await Axios.get(BASE_URL+'/getUserData', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => {
                    console.log(response.data);
                    if(response.data) {
                        console.log(response.data);
                        const user_data = {
                            id: response.data.user_id,
                            username: response.data.username,
                            avatar_image: response.data.avatar_image,
                        }
                        localStorage.setItem('user-data', JSON.stringify(user_data));
                        setCurrentUser(user_data);
                    }
                });
            } else {
                setCurrentUser(JSON.parse(localStorage.getItem('user-data')));
            } 
        }

        getUserData();
    }, []);

    useEffect(() => {

        // Get all user contacts
        const getAllContacts = async() => {
            const token = await getAccessTokenSilently();

            await Axios.get(BASE_URL+'/getContacts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if(response.data) {
                    setContacts(response.data);
                }
            });
        };

        if(currentUser) {
            getAllContacts();
            socket.current = io(BASE_URL);
            socket.current.emit("add-user",currentUser.id);
        }
    }, [currentUser]);

    // Change current chat
    const handleChatChange = (chat) =>{
        setCurrentChat(chat)
    }

    return (
        <>
        <Header></Header>
        <Content>
            <div className="row">
                <div className="col-md-4">
                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                </div>
                <div className="col-md-8">
                    {currentChat===undefined?
                        <h2>Welcome</h2>:
                        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                    }
                </div>
            </div>
        </Content>
        </>
    );

} 


export default Chat;