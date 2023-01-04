import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input"; 
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

const ChatContainer = ({currentChat, currentUser, socket, notifyUser, notifications}) => {

    const {getAccessTokenSilently} = useAuth0();

    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const [messages,setMessages] = useState([]);
    const [arrivalMessage,setArrivalMessage] = useState([]);
    const scrollRef = useRef();

    // Retrives all message in the chat
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

    useEffect(() => {
        getAllMessages();
    }, [currentChat])

    // Create a new message in the db
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

    // Send message
    const handleSendMsg = async(msg) => {

        // Stores message
        createMessage(msg);

        // Update contact view
        socket.current.emit('send-msg', {
            from: currentUser.id,
            to: currentChat.id,
            message: msg,
        });

        // Update user view
        const msgs = [...messages];
        msgs.push({fromSelf:true, message:msg});
        setMessages(msgs);
    }

    // Receive message
    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-receive", (data) => {
                if(data.from === currentChat.id) {
                    setArrivalMessage({fromSelf: false, message: data.message});
                } else {
                    if(notifications[data.from]) {
                        const new_notifications = [...notifications];
                        new_notifications[data.from] = new_notifications[data.from] + 1;
                        notifyUser(new_notifications); 
                    } else {
                        const new_notifications = [...notifications];
                        new_notifications[data.from] = 1;
                        notifyUser(new_notifications); 
                    }
                }
            });
        }
    },[]);

    // Update new message
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev,arrivalMessage]);
    }, [arrivalMessage]);

    // Update scroll view
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
                                                    <img src={`${message.fromSelf?currentChat.avatar_image:currentUser.avatar_image}`} />
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