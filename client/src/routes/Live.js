import React, { useEffect, useRef, useState, createElement } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';
import Header from "../general/header";
import { useNavigate } from 'react-router-dom'
import Content from "../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneSlash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";


function Live(){
  const BASE_URL = process.env.REACT_APP_SERVER_URL;

  // Retrives token
  const {getAccessTokenSilently} = useAuth0();

  const navigate = useNavigate();

  // Socket objecy
  const socket = useRef();

  // Scroll messages
  const scrollRef = useRef();
  
  // Current User
  const [currentUser,setCurrentUser] = useState();

  // Get matched lives
  const [lives, setLives] = useState();
  
  // Change displayed html
  const [roomSelected, setRoomSelected] = useState(false);
  const roomNumb = useRef();

  // Partecipants in live
  const [live_users, setLiveUsers] = useState([]);

  // Single message
  const [message, setMessage] = useState('');

  // Messages
  const [messages, setMessages] = useState([]);

  // Check if user is a broadcaster
  const [is_broadcaster, setIsBroadcaster] = useState(false);

  //client
  //const [rtcPeerConnections, setRtcPeerConnections] = useState({});
  let rtcPeerConnections = {};
  //let pcs: { [socketId: string]: RTCPeerConnection };
  
  
  const config = {
    iceServers: [
      {
        urls: "stun:relay.metered.ca:80",
      },
      {
        urls: "turn:relay.metered.ca:80",
        username: "0f42426ece9c4d709251c1cb",
        credential: "xwd/lSd6Neqdkg04",
      },
      {
        urls: "turn:relay.metered.ca:443",
        username: "0f42426ece9c4d709251c1cb",
        credential: "xwd/lSd6Neqdkg04",
      },
      {
        urls: "turn:relay.metered.ca:443?transport=tcp",
        username: "0f42426ece9c4d709251c1cb",
        credential: "xwd/lSd6Neqdkg04",
      },
    ],
  };
  const streamConstraints = {  audio: true, video: { height: 480 } };

  
  const broadcasterName = document.getElementById("broadcasterName");
  //const viewers = document.getElementById("viewers");


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
                        native_l: response.data.native_l,
                        new_l: response.data.new_l,
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

    const getPossibleLives = async() => {
        const token = await getAccessTokenSilently();
        await Axios.get(BASE_URL+'/getPossibleLives', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params:{
                native_l: currentUser.new_l
            }
        }).then((response) => {
            if(response.data){
                setLives(response.data);
            }
            
        });
    };

    const openSocket = async()=>{
      const token = await getAccessTokenSilently();
      socket.current = io(BASE_URL, 
          { 
              query: { type: 'live' },
              extraHeaders: { Authorization: `Bearer ${token}`}
          }
          );

      socket.current.on("liveMsg", function (msg, user, avatar) {

        //const new_message = [...messages];
        //new_message.push({user: user ,avatar: avatar, msg: msg});
        //setMessages(new_message);

        setMessages(messages => [...messages, {user: user ,avatar: avatar, msg: msg}]);  
        //bisogna usare questo metodo, non si può usare push e setMessages(new_messages)
        //dato che il listener .on(liveMsg) viene registrato in useEffect, 
        //la lista messages sarà quella del momento in cui viene usato useEffect e non quella aggiornata

        
      });
          
          
      // message handlers, funzione del brodcaster
      //BROADCASTER INVIA OFFER
      socket.current.on("new viewer", function (viewer) {
        console.log(viewer);
        
        rtcPeerConnections[viewer.id] = new RTCPeerConnection(config);
        
        const videoElement = document.querySelector("video");

        const stream = videoElement.srcObject;
        stream
          .getTracks()
          .forEach((track) => rtcPeerConnections[viewer.id].addTrack(track, stream));
      
        rtcPeerConnections[viewer.id].onicecandidate = (event) => {
          if (event.candidate) {
            console.log("sending ice candidate");
            socket.current.emit("candidate", viewer.id, {
              type: "candidate",
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            });
          }
        };
          
        rtcPeerConnections[viewer.id]
          .createOffer()
          .then((sessionDescription) => {
            rtcPeerConnections[viewer.id].setLocalDescription(sessionDescription);
            socket.current.emit("offer", viewer.id, {
              type: "offer",
              sdp: sessionDescription,
              broadcaster: {
                //room: roomNumb.current,
                room: currentUser.id,
                name: currentUser.username,
              },
            });
          })
          .catch((error) => {
            console.log(error);
          });
          
      });

      socket.current.on('add new viewer', function(viewer) {
        setLiveUsers(live_users => [...live_users, viewer]);  
      }); 

      socket.current.on('old users', function(viewers) {
        setLiveUsers(viewers);
      });

      socket.current.on('remove viewer', function(viewers) {
        setLiveUsers(viewers);
      });

      socket.current.on('broadcaster disconnected', function() {
        console.log('broad-disc');
        navigate(0);
      });
        
      socket.current.on("candidate", function (id, event) {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        });

        rtcPeerConnections[id].addIceCandidate(candidate);
        
      });
          
      //VIEWER RICEVER OFFER ED INVIA ANSWER
      socket.current.on("offer", function (broadcaster, sdp) {
        // broadcasterName.innerText = broadcaster.name + "is broadcasting...";
        
        //NOTA
        //broadcaster.id viene aggiunto nella offer in node js
        //NON e' l'id auth0, ma l'id socket.io
        //broadcaster.room è l'id auth0 = stanza 
        rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(config);
      
        rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp);
      
        rtcPeerConnections[broadcaster.id]
          .createAnswer()
          .then((sessionDescription) => {
            rtcPeerConnections[broadcaster.id].setLocalDescription(
              sessionDescription
            );
            socket.current.emit("answer", {
              type: "answer",
              sdp: sessionDescription,
              room: broadcaster.room,
            });
          });
        
        rtcPeerConnections[broadcaster.id].ontrack = (event) => {
            const videoElement = document.querySelector("video");
          videoElement.srcObject = event.streams[0];
        };
        
        rtcPeerConnections[broadcaster.id].onicecandidate = (event) => {
          if (event.candidate) {
            console.log("sending ice candidate");
            socket.current.emit("candidate", broadcaster.id, {
              type: "candidate",
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            });
          }
        };

      });
          
      socket.current.on("answer", function (viewerId, event) {

        rtcPeerConnections[viewerId].setRemoteDescription(
          new RTCSessionDescription(event)
        );
        
      });
    };

    if(currentUser) {
      getPossibleLives();

      openSocket();

    }
  }, [currentUser]);
  

  const handleClickBroadcaster = () => {
    // if (roomNumb.current == undefined || !currentUser.username) {
    if (!currentUser.username) {
      alert("Please type a room number and a name");
    } else {

      setRoomSelected(true);
  
      setIsBroadcaster(true);    

      navigator.mediaDevices
        .getUserMedia(streamConstraints)
        .then(function (stream) {
          const videoElement = document.querySelector("video");
          videoElement.srcObject = stream;
          videoElement.volume = 0;
          var factor = "-1";
          videoElement.style.transform       = "scaleX(" + factor + ")";
          socket.current.emit("register as broadcaster", currentUser.id, currentUser.native_l);
          //socket.current.emit("register as broadcaster", roomNumb.current);
        })
        .catch(function (err) {
          console.log("An error ocurred when accessing media devices", err);
        });
    }
  }

  const handleClickViewer = (room) => {
    if (!currentUser.username || !room) {
      alert("Please type a room number and a name");
    } else {

      setRoomSelected(true);
  
      socket.current.emit("register as viewer", {room: room, id:currentUser.id, name:currentUser.username, avatar: currentUser.avatar_image});
    }
  }

  const handleSendMessage = () => {
    const data = {
      //room: roomNumb.current,
      user: currentUser.username,
      avatar: currentUser.avatar_image,
      msg: message,
    };

    socket.current.emit("liveMsg", data);
    
    const new_message = [...messages];
    new_message.push({user: currentUser.username, avatar: currentUser.avatar_image, msg: message});
    setMessages(new_message);

    setMessage('');
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);




  return (
    <>
      <>
      {!roomSelected ? 
      <>
      <Header></Header>
      <Content>
      <div id="selectRoom">
          {/*<label htmlFor="roomNumber">Type the room number</label>
          <input id="roomNumber" type="text" onChange={(e)=>{roomNumb.current=e.target.value}} />  */}
          <button id="joinBroadcaster" onClick={()=>handleClickBroadcaster()}>Join as Broadcaster</button>
          {/*<button id="joinViewer" onClick={()=>handleClickViewer()}>Join as Viewer</button>*/}

          {lives && lives.map((live, index) => {
                          return (
                            <div key={live.id} className="participant mb-4">
                              <div className="card partecipant-card">
                                <div className="card-body">
                                  <div className="avatar">
                                    <img src={live.avatar} />
                                  </div>
                                  <div className="username">
                                    <p>{live.username}</p>
                                  </div>
                                  <button id="joinViewer" onClick={()=>handleClickViewer(live.id)}>Join {live.id}</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

      </div>
      </Content>
      </>
      :
        <div className="live-chat-container">
          <div className="live-chat-content">
            <div className="row" style={{height: '100%'}}>
              <div className="col-md-2 partecipants-container d-flex align-items-center justify-content-center" style={{width: '20%', height:'100%'}}>
                <div className="card">
                  <div className="card-header">
                      <div className="title mt-3">
                        <h4>Partecipants</h4>
                      </div>
                  </div>
                  <div className="card-body main-card-body">
                    <div className="participants-list-container">
                      <div className="participants-list-content">
                        {live_users.map((viewer, index) => {
                          return (
                            <div key={viewer.id} className="participant mb-4">
                              <div className="card partecipant-card">
                                <div className="card-body">
                                  <div className="avatar">
                                    <img src={viewer.avatar} />
                                  </div>
                                  <div className="username">
                                    <p>{viewer.name}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-7" style={{width: '60%', height:'100%'}}>
                <div className="main-section-container">
                  <div className="main-section-content">
                    <div className="card">
                      <div className="card-body">
                        <div className="video-container">
                          <div className="video">
                            <video autoPlay id="myVideo"></video>
                          </div>
                        </div>
                        <div className="endcall-button-container">
                          <div className="endcall-button">
                            <button className="btn" onClick={() => {navigate(0)}}>
                              <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-md-3" style={{width: '20%', height:'100%'}}>
                <div className="chat-container">
                  <div className="chat-content d-flex align-items-center justify-content-center">
                    <div className="card">
                      <div className="card-header">
                        <h4>Chat</h4>
                      </div>
                      <div className="card-body">
                        <div className="messages-container">
                          <div className="messages">
                            { messages && 
                            <>
                            {messages.map((message, index) => {
                              return (
                                <div key={index} ref={scrollRef} className="message-item mb-3">
                                  <div className="message-avatar">
                                    <img src={message.avatar} />
                                  </div>
                                  <div className="message-container">
                                    <div className="message-content">
                                      <div className="username">
                                        <p><strong>{message.user}</strong></p>
                                      </div>
                                      <div className="message-text">
                                        <p>{message.msg}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            </>
                            }
                          </div>
                        </div>
                      </div>
                      {!is_broadcaster &&
                      <div className="card-footer">
                        <div className="message-input">
                          <input type="text" placeholder='type your message here' value={message} onChange={(e) => setMessage(e.target.value)}/>
                          <button className='submit btn' type='submit' onClick={() => handleSendMessage()}>
                            <FontAwesomeIcon className="icon" icon={faPaperPlane}/>
                          </button>
                        </div>
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      }
      

      

      </>
    </>
      
  );




}

export default Live;