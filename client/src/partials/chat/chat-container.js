import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input"; 
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

// Componente utilizzato renderizzare la chat con l'utente selezionato.

const ChatContainer = ({currentChat, currentUser, socket, notifyUser, notifications}) => {

    const {getAccessTokenSilently} = useAuth0();

    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    // Variabile di stato per la gestione dei messaggi
    const [messages,setMessages] = useState([]);

    // Variabile di stato per la gestione dei messaggi in arrivo
    const [arrivalMessage,setArrivalMessage] = useState([]);

    const scrollRef = useRef();

    // Preleva i messaggi vecchi con l'utente selezionato
    const getAllMessages = async() => {
        const token = await getAccessTokenSilently();
        await axios({method: 'post', url: BASE_URL + '/getAllMsgs', 
            headers: {'Authorization': `Bearer ${token}`}, 
            params : {
                to: currentChat.id,
            } 
        }).then((response) => {
            if(response.data) {
                setMessages(response.data);
            }
        });
    }

    // Invocato quando cambia l'utente selezionato
    useEffect(() => {
        getAllMessages();
    }, [currentChat]);

    // Memorizza nuovo messaggio nel db(Mongo)
    // Il from è estratto dal token.
    const createMessage = async(msg) => {
        const token = await getAccessTokenSilently();

        await axios({method: 'post', url: BASE_URL + '/addMsg', 
            headers: {'Authorization': `Bearer ${token}`}, 
            params : {
                to: currentChat.id,
                message: msg,
            } 
        }).then((response) => {
            if(response.data) {
                console.log(response.data);
            }
        });
    }

    const handleSendMsg = (msg) => {

        //Salva msg nel db
        createMessage(msg);

        // Invia msg tramite socket
        socket.current.emit('send-msg', {
            from: currentUser.id,
            to: currentChat.id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({fromSelf:true, message:msg});
        setMessages(msgs);
    }

    // Invocato al montaggio del componente, al cambio del contatto selezionato
    // e per ogni nuova notifica( altrimenti non sarebbe possibile aggiornate notification )
    useEffect(() => {
        if(socket.current) {

            socket.current.on("msg-receive", (data) => {

                // Se il messaggio ricevuto riguarda la chat attuale
                if(data.from === currentChat.id) {
                    // Mostra nuovo messaggio all'utente
                    setArrivalMessage({fromSelf: false, message: data.message});
                } else {
                    // Aggiorna le notifiche degli altri contatti
                    var new_notifications = {...notifications};
                    if(notifications[data.from]) {
                        new_notifications[data.from] = new_notifications[data.from] + 1;
                        notifyUser(new_notifications); 
                    } else {
                        new_notifications[data.from] = 1;
                        notifyUser(new_notifications); 
                    }
                }

            });

            return () => {
                socket.current.off('msg-receive');
            }

        }
    }, [currentChat, notifications]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev,arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return(
        <>
        <div className="chat-component-container">
            <div className="chat-component-content">
                <div className="card">
                    <div className="card-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img src={currentChat.avatar_image} alt="avatar" />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="chat-messages-container">
                            <div className="chat-messages-content">
                                {messages.map((message) => {
                                    return (
                                        <div className="message-scroll-div mb-4" ref={scrollRef} key={uuidv4()}>
                                            <div className={`message-item ${message.fromSelf?"sended":"recieved"}`}>
                                                {!message.fromSelf &&
                                                <div className={`message-avatar ${message.fromSelf?"sended":"recieved"}`}>
                                                    <img src={`${message.fromSelf?currentUser.avatar_image:currentChat.avatar_image}`} />
                                                </div>
                                                }
                                                <div className="message-content">
                                                    <p>
                                                        {message.message}
                                                    </p>
                                                </div>
                                                {message.fromSelf && 
                                                <div className={`message-avatar ${message.fromSelf?"sended":"recieved"}`}>
                                                    <img src={`${message.fromSelf?currentUser.avatar_image:currentChat.avatar_image}`} />
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="chat-input-container">
                            <ChatInput handleSendMsg={handleSendMsg} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );

}


export default ChatContainer;