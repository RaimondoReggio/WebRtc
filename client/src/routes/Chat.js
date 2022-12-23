import axios from 'axios';
import React, {useState,useEffect, useRef}from 'react'
import styled from 'styled-components'

import {useNavigate} from 'react-router-dom';
import Contacts from '../partials/chat/contacts';

import ChatContainer from '../partials/chat/chat-container';
import {io}  from 'socket.io-client';
function Chat() {
  const { getAccessTokenSilently } = useAuth0();
  const BASE_URL = process.env.REACT_APP_SERVER_URL;
  const socket = useRef();
  const navigate = useNavigate();
  const [currentUser,setCurrentUser] = useState(undefined);
  const [contacts,setContacts]= useState([]);
  const [currentChat,setCurrentChat] = useState(undefined);
  const { user } = useAuth0();

  useEffect(() => {
    async function fetchData() {
        if (!localStorage.getItem("user-data")){
            const token = await getAccessTokenSilently();

            await Axios.get(BASE_URL+"/getUserData", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                const userData = {username: response.data.username, avatarImage: response.data.avatarImage};
                localStorage.setItem(
                    "user-data",
                    userData
                );
                setCurrentUser(userData);
            })
        }
        else{
                setCurrentUser(localStorage.getItem("user-data"));
        }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
          const token = await getAccessTokenSilently();

            await Axios.get(BASE_URL+"/getContacts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                
                const conts = response.data;
                setContacts(conts);
            })
      }
    }
    fetchData();
  }, [currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat)
  }
useEffect(()=>{
  if(currentUser){
    socket.current = io(BASE_URL);
    socket.current.emit("add-user",user.sub);
  } 
},[currentUser])

  return (<>
    <Container>
<div className='container'>
  <Contacts contacts={contacts} currentUser={currentUser}  changeChat={handleChatChange}/> 
  
  

  <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
</div>

    </Container>
    </>
  )
}


const Container = styled.div`
height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat