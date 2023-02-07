import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';
import Header from "../general/header";
import TextArea from 'antd/es/input/TextArea';
import { Input, Modal } from "antd";
import { useNavigate } from 'react-router-dom'
import Content from "../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneSlash, faPaperPlane, faCamera, faPlus, faTv } from "@fortawesome/free-solid-svg-icons";
import england_flag from '../assets/flags/england.png';
import spain_flag from '../assets/flags/spain.png';
import italy_flag from '../assets/flags/italy.png';
import sweden_flag from '../assets/flags/sweden.png';
import { message as msgAlert} from "antd";

// Componente utilizzato per gestire le live, sia da viewer che broadcaster

function Live(){
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    const navigate = useNavigate();

    const socket = useRef();

    const scrollRef = useRef();

    // Variabile utente
    const [currentUser,setCurrentUser] = useState();

    // Lista delle lives attive
    const [lives, setLives] = useState();

    // Variabile booleana
    const [roomSelected, setRoomSelected] = useState(false);

    // Lista partecipanti nella live selezionata
    const [live_users, setLiveUsers] = useState([]);

    const [message, setMessage] = useState('');

    // Messaggi presenti nella live selezionata
    const [messages, setMessages] = useState([]);

    // Flag
    const [is_broadcaster, setIsBroadcaster] = useState(false);

    // Variabili relative alla live selezionata
    const [roomName, setRoomName] = useState();
    const [roomDescr, setRoomDescr] = useState();

    const [create_live, setCreateLive] = useState(false);

    const flags_array = {
      italian: italy_flag,
      spanish: spain_flag,
      swedish: sweden_flag,
      english: england_flag,
    }

    // Dizionario => socket.id: RTCPeerConnection
    // utilizzato dal Broadcaster gestire i Viewers connessi
    // dal Viewer per memorizzare la connessione al Broadcaster
    // socket.id è relativo all'id del socket in nodejs
    let rtcPeerConnections = {};

    // Configurazione iceServers, indica i servizi STUN e TURN da utilizzare a RTCPeerConnection
    const config = {
      iceServers: [
          {
            urls: "stun:relay.metered.ca:80",
          },
          {
            urls: "turn:relay.metered.ca:80",
            username: "bd6fda260208d0cfd53581f5",
            credential: "LIPQ4UGF2Fs8lE45",
          },
          {
            urls: "turn:relay.metered.ca:443",
            username: "bd6fda260208d0cfd53581f5",
            credential: "LIPQ4UGF2Fs8lE45",
          },
          {
            urls: "turn:relay.metered.ca:443?transport=tcp",
            username: "bd6fda260208d0cfd53581f5",
            credential: "LIPQ4UGF2Fs8lE45",
          },
      ],
    };
    
    // Contraint per la trasmissione
    const streamConstraints = { audio: true, video: true };


    useEffect(() => {

      // Preleva informazioni utente tramite API
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

      // Preleva le lives compatibili con la lingua dell'utente
      // ed attive sul server tramite API
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

      // Inizializza connessione alla socket.io\live 
      // per la chat nella live
      const openSocket = async()=>{
        const token = await getAccessTokenSilently();
        socket.current = io(BASE_URL, 
            { 
                query: { type: 'live' },
                extraHeaders: { Authorization: `Bearer ${token}`}
            }
            );

        //  Evento ricevuto sia dall'utente Broadcaster che Viewer
        socket.current.on("liveMsg", function (msg, user, avatar) {

          setMessages(messages => [...messages, {user: user ,avatar: avatar, msg: msg}]);  
          //bisogna usare questo metodo, non si può usare push e setMessages(new_messages)
          //dato che il listener .on(liveMsg) viene registrato in useEffect, 
          //la lista messages sarà quella del momento in cui viene usato useEffect e non quella aggiornata
        });

        // VIEWER => BROADCASTER (1)
        // Evento inviato dal Viewer ed invocato sul client Broadcaster
        // come primo step del SIGNALING. Il Viewer invia la richiesta di voler accedere alla live
        // il broadcaster in risposta invierà una offer.
        socket.current.on("new viewer", function (viewer) {
          
            // viewer.id è il socket.id del viewer sul server nodejs
            // creiamo un oggetto di tipo RTCPeerConnection associato al viewer
            // per gestire la successiva fase di negoziazione ICE Candidate
            rtcPeerConnections[viewer.id] = new RTCPeerConnection(config);
            
            const videoElement = document.querySelector("video");
            const stream = videoElement.srcObject;

            // Tramite getTracks() otteniamo i tracks (audio, video)
            // Aggiungiamo alla connessione RTCPeerConnections con il viewer i tracks
            stream
              .getTracks()
              .forEach((track) => rtcPeerConnections[viewer.id].addTrack(track, stream));
          
            // Registriamo l'evento onIceCanditate, questo verrà invocato dal ICE Layer(Browser)
            // nel momento in cui è stato trovato un nuovo IceCandidate ed è quindi necessario
            // inviarlo all'altro peer tramite SIGNALING
            rtcPeerConnections[viewer.id].onicecandidate = (event) => {
              if (event.candidate) {
                // Invio IceCandidate all'altro peer(Viewer) tramite socket.io
                socket.current.emit("candidate", viewer.id, {
                  type: "candidate",
                  label: event.candidate.sdpMLineIndex,
                  id: event.candidate.sdpMid,
                  candidate: event.candidate.candidate,
                });
              }
            };
              
            // Viene creata una offer per il peer(Viewer) che desidera connettersi
            rtcPeerConnections[viewer.id]
              .createOffer()
              .then((sessionDescription) => {
                // Memorizza le configurazioni locali(lato broadcaster) della connessione con il Viewer
                // il browser inizia ad invocare onIceCandidate
                rtcPeerConnections[viewer.id].setLocalDescription(sessionDescription);

                // Invio della offer al Viewer tramite socket.io
                socket.current.emit("offer", viewer.id, {
                  type: "offer",
                  sdp: sessionDescription,
                  broadcaster: {
                    room: currentUser.id,
                    name: currentUser.username,
                  },
                });

              })
              .catch((error) => {
                console.log(error);
              });
              
        });

        // VIEWER <= BROADCASTER (2)
        // Evento inviato dal Broadcster in risposta a "new-viewer"
        // invocato sul client Viewer
        socket.current.on("offer", function (broadcaster, sdp) {
          setRoomSelected(true); //Cambia render grafico
          
          //NOTA
          //broadcaster.id è aggiunto nel server nodejs
          //non e' l'id auth0, ma l'id socket.io
          //broadcaster.room è l'id auth0 = stanza 

          rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(config);

          // Memorizza le configurazioni ricevute dal broadcaster come descrittore 
          // della end-remota 
          rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp);
        
          // Si crea una answer da inviare al broadcaster
          rtcPeerConnections[broadcaster.id]
            .createAnswer()
            .then((sessionDescription) => {
              // Memorizza le configurazioni locali(lato viewer) della connessione con il Broadcaster
              // il browser inizia ad invocare onIceCandidate
              rtcPeerConnections[broadcaster.id].setLocalDescription(
                sessionDescription
              );
              //Si invia la answer al Broadcaster tramite socket.io
              socket.current.emit("answer", {
                type: "answer",
                sdp: sessionDescription,
                room: broadcaster.room,
              });
            });
          

          rtcPeerConnections[broadcaster.id].ontrack = (event) => {
              const videoElement = document.querySelector("video");
              videoElement.srcObject = event.streams[0];
              videoElement.style.transform       = "scaleX(" + "-1" + ")";
          };

          rtcPeerConnections[broadcaster.id].onicecandidate = (event) => {
            if (event.candidate) {
              // Invio IceCandidate all'altro peer(Broadcaster) tramite socket.io
              socket.current.emit("candidate", broadcaster.id, {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
              });
            }
          };


        });


        // VIEWER => BROADCASTER (3)
        // Evento inviato dal Broadcaster ed invocato sul client Viewer
        socket.current.on("answer", function (viewerId, event) {

          rtcPeerConnections[viewerId].setRemoteDescription(
            new RTCSessionDescription(event)
          );
          
        });

        // VIEWER <=> BROADCASTER (dopo setLocalDescript)
        // Evento inviato sia da Viewer che da Broadcaster
        // per comunicare all'altro peer un proprio ICE Candidate
        socket.current.on("candidate", function (id, event) {
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          });
          // Si aggiunge l'ICE Candidate al ICE Layer
          rtcPeerConnections[id].addIceCandidate(candidate);
          
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
          

        // Viewer prova ad entrare in una live non più disponibile
        socket.current.on("room not exist", function (room) {
            countDown("Room does not exist", "Sorry, this room has been closed");
        });

        // Viewer prova ad entrare in una live senza avere punti sufficienti
        socket.current.on("not enough points", function (room) {
          countDown("Not enough points", "“sine pecunia ne cantantur missae“");
        });

      };

      if(currentUser) {
        getPossibleLives();

        openSocket();

      }
    }, [currentUser]);

    

    // Gestisce l'avvio di una diretta da parte dell'utente
    // che prende il ruolo di Broadcaster
    const handleClickBroadcaster = () => {
      if (!roomName && !roomDescr) {
          error("Pls, all fields must be filled", 2);
      } else {

        setRoomSelected(true);

        setIsBroadcaster(true);    
        // Richiesta accesso camera e microfono
        navigator.mediaDevices
          .getUserMedia(streamConstraints)
          .then(function (stream) {
            const videoElement = document.querySelector("video");
            videoElement.srcObject = stream;
            videoElement.volume = 0;
            var factor = "-1";
            videoElement.style.transform = "scaleX(" + factor + ")";

            // Si registra l'utente come Broadcaster, l'id della live è l'id Auth0 dell'utente
            socket.current.emit("register as broadcaster", currentUser.id, currentUser.native_l, roomName, roomDescr);

          })
          .catch(function (err) {
            console.log("An error ocurred when accessing media devices", err);
          });
      }
    }

    // Gestisce l'accesso ad una live da parte di un utente
    // che prende il ruolo di Viewer
    const handleClickViewer = (room) => {
      if (!currentUser.username || !room) {
        alert("Please type a room number and a name");
      } else {
        // Si registra l'utente come Viewer
        socket.current.emit("register as viewer", {room: room, userId:currentUser.id, name:currentUser.username, avatar: currentUser.avatar_image});
      }
    }

    // Invio messaggio nella live
    const handleSendMessage = () => {
      //Il from e l'id della live vengono aggiunte lato server
      const data = {
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

    const mute = () => {
      const videoElement = document.querySelector("video");
      videoElement.srcObject.getTracks().forEach(t => t.enabled = !t.enabled);
    }

    // MessageBox
    const [messageApi, contextHolder] = msgAlert.useMessage();

    const error = (msg, duration) => {
        messageApi.open({
            type: 'error',
            content: msg,
            duration: duration,
        });
    };

    // MessageBox
    const countDown = (title, message) => {
      let secondsToGo = 5;
      const modal = Modal.error({
        title: title,
        content: message,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    };


    return (
    <>
    <>
    {!roomSelected ? 
    <>

    <Header currentSelection={0}></Header>
    <Content>
    {contextHolder}
    <div id="selectRoom" style={{height: '100%'}}>
      <div className="button-open-create-room-modal-container">
        <button className="btn button-open-create-room-modal"><FontAwesomeIcon icon={faTv} onClick={() => {setCreateLive(true)}}/></button>
      </div>
        <div className="possible-lives-container d-flex justify-content-center align-items-center" style={{height: '100%'}}>
          <div className="possible-lives-content">
            <div className="rooms row">
              {lives && lives.map((live, index) => {
                return (
                  <div className="col-md-4" key={index}>
                    <div className="card room-card">
                        <div className="card-body">
                            <div className="flag-image">
                                <img src={flags_array[live.native_l]} />
                            </div>
                            <div className="room">
                              <div className="row">
                                <div className="col-md-5 d-flex justify-content-center">
                                  <div className="avatar">
                                    <img src={live.avatar_image} />
                                  </div>
                                </div>
                                <div className="col-md-7 d-flex align-items-center justify-content-left">
                                  <div className="info-content">
                                    <div className="room-name mb-2">
                                      <h4>{live.roomName}</h4>
                                    </div>
                                    <div className="room-l mb-2">
                                      <p>{live.native_l}</p>
                                    </div>
                                    <div className="room-description mb-4">
                                      <p>{live.roomDescr}</p>
                                    </div>
                                    <div className="button-join-live-container">
                                      <button className="btn button-join-live" onClick={() => handleClickViewer(live.id)}>join</button>
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
    </div>
    <Modal
    title="Create your room"
    className="modal-create-room"
    centered
    open={create_live}
    onCancel={() => setCreateLive(false)}
    >
    <div className="form-outline my-4">
        <Input placeholder="Room Name" onChange={(e) => {setRoomName(e.target.value)}} />
    </div>
    <div className="form-outline mb-4">
        <TextArea rows={4} placeholder="Write a short description of the room" maxLength={50} onChange={(e) => {setRoomDescr(e.target.value)}}/>
    </div>
    <div className="button-create-room-container">
      <button className="btn create-room-button" id="joinBroadcaster" onClick={()=>handleClickBroadcaster()}>Create room</button>
    </div>
    </Modal>
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
                    <div className="control-button-container">
                      <div className="endcall-button">
                        <button className="btn" onClick={() => {navigate(0)}}>
                          <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
                        </button>
                      </div>
                      <div className="cameraoff-button">
                        <button className="btn" onClick={() => {mute()}}>
                          <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
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