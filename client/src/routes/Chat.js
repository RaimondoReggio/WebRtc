import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';
import Content from "../general/content";
import Header from "../general/header";
import Contacts from "../partials/chat/contacts";
import ChatContainer from "../partials/chat/chat-container";
import { message } from "antd";

function Chat() {
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    const socket = useRef();

    // currentUser è l'utente loggato
    const [currentUser,setCurrentUser] = useState();
    // Lista di contatti
    const [contacts,setContacts]= useState([]);
    // currentChat indica la chat selezionata
    const [currentChat,setCurrentChat] = useState();

    const [newMessages, setNewMessages] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    const error = (msg, duration) => {
        messageApi.open({
            type: 'error',
            content: msg,
            duration: duration,
        });
    };
    

    useEffect(() => {
        // Preleva o aggiorna i dati dell'utente dal localStorage
        const getUserData = async() => {

            // Controlla se i dati dell'utente sono già nel localStorage
            if(!localStorage.getItem("user-data")) {
                const token = await getAccessTokenSilently();
                
                //Preleva dati utente tramite API
                await Axios.get(BASE_URL+'/getUserData', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then((response) => {
                    console.log(response.data);
                    if(response.data) {
                        const user_data = {
                            id: response.data.user_id,
                            username: response.data.username,
                            avatar_image: response.data.avatar_image,
                            native_l: response.data.native_l,
                            new_l: response.data.new_l,
                        }
                        console.log(response.data.user_id);
                        // Aggiorna localStorage
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

    // Invocata quando i dati dell'utente sono stati caricati
    useEffect(() => {
        // Preleva i contatti dell'utente tramite API
        const getAllContacts = async() => {
            const token = await getAccessTokenSilently();

            await Axios.get(BASE_URL+'/getContacts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if(response.data != 'Unable to get contacts') {
                    setContacts(response.data);
                }else{
                    console.log("Pls add contacts");
                    error('Pls add contacts', 2);
                }
            });
        };

        // Inizializza connessione alla socket.io\chat 
        // per la chat tra utenti
        const openSocket = async()=>{
            const token = await getAccessTokenSilently();
            socket.current = io(BASE_URL, 
                { 
                    query: { type: 'chat' },
                    extraHeaders: { Authorization: `Bearer ${token}`}
                }
                );
            // Per aggiungere l'utente alla lista deli utenti online
            socket.current.emit("add-user",currentUser.id);
        };


        if(currentUser) {
            getAllContacts();
            openSocket();
        }

    }, [currentUser]);

    // Callback richiamata dal componente Contacts
    const handleChatChange = (chat) =>{
        setCurrentChat(chat)
    }
    // Callback richiamata dal componente 
    // ChatContaier per segnalare nuova notifica
    // Contacts per azzerare le notifiche quando si cambia utente
    const handleMessagesChange = (new_messages) => {
        setNewMessages(new_messages);
    }

    return (
        <>

        <Header currentSelection={2}></Header>
        <Content>
            {contextHolder}
            <div className="chat-container">
                <div className="chat-content">
                    <div className="row" style={{height: '100%'}}>
                        <div className="col-md-4 contacts-column d-flex align-items-center justify-content-center">
                            <div className="card">
                                <div className="card-body">
                                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} notifications={newMessages} notifyUser={handleMessagesChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 chat-column">
                            {currentChat===undefined?
                                <h2>Welcome</h2>:
                                <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} notifications={newMessages} notifyUser={handleMessagesChange} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Content>
        </>
    );

} 


export default Chat;