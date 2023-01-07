import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';
import Header from "../general/header";
import { useNavigate } from 'react-router-dom'
import Content from "../general/content";

function Live(){
    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    const navigate = useNavigate();

    const socket = useRef();

    const [currentUser,setCurrentUser] = useState();
    const [lives, setLives] = useState();

    const [roomSelected, setRoomSelected] = useState(false);
    const roomNumb = useRef();

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
    const viewers = document.getElementById("viewers");


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

        const getPossibleLives = async() => {
            const token = await getAccessTokenSilently();
            await Axios.get(BASE_URL+'/getPossibleLives', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if(response.data){
                    setLives(response.data);
                }
                
            });
        };

        if(currentUser) {
            //getPossibleLives();
            socket.current = io(BASE_URL, { query: { type: 'live' } });

            socket.current.on("liveMsg", function (msg, user) {
                let li = document.createElement("li");
                li.innerText = user + ": "+msg;
                viewers.appendChild(li);
              });
              
              
              // message handlers
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
                        room: roomNumb.current,
                        name: currentUser.username,
                      },
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });

                  
              
                let li = document.createElement("li");
                li.innerText = viewer.name + " has joined";
                //viewers.appendChild(li);
              });
              
              socket.current.on("candidate", function (id, event) {
                var candidate = new RTCIceCandidate({
                  sdpMLineIndex: event.label,
                  candidate: event.candidate,
                });
                ;
                rtcPeerConnections[id].addIceCandidate(candidate);
                
              });
              
              socket.current.on("offer", function (broadcaster, sdp) {
               // broadcasterName.innerText = broadcaster.name + "is broadcasting...";
                

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
                      room: roomNumb.current,
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
                ;
                rtcPeerConnections[viewerId].setRemoteDescription(
                  new RTCSessionDescription(event)
                );
                
              });

        }
    }, [currentUser]);
    

    const handleClickBroadcaster = () => {
        if (roomNumb.current == undefined || !currentUser.username) {
            alert("Please type a room number and a name");
          } else {

            setRoomSelected(true);
        
            /*divSelectRoom.style = "display: none;";
            divConsultingRoom.style = "display: block;";*/
            //broadcasterName.innerText = user.name + " is broadcasting...";
            

            navigator.mediaDevices
              .getUserMedia(streamConstraints)
              .then(function (stream) {
                const videoElement = document.querySelector("video");
                videoElement.srcObject = stream;
                videoElement.volume = 0;
                var factor = "-1";
                //videoElement.style.transform       = "scaleX(" + factor + ")";
                socket.current.emit("register as broadcaster", roomNumb.current);
              })
              .catch(function (err) {
                console.log("An error ocurred when accessing media devices", err);
              });
          }
    }

    const handleClickViewer = () => {
        if (roomNumb.current == undefined || !currentUser.username) {
            alert("Please type a room number and a name");
          } else {

            setRoomSelected(true);

            var input = document.createElement("input");
            input.setAttribute('type', 'text');
        
            document.body.appendChild(input);
        
            var btn = document.createElement("button");
        
            btn.onclick = function () {
              let e = {
                room: roomNumb.current,
                user: currentUser.username,
                msg: input.value,
              };
              socket.current.emit("liveMsg", e);
              let li = document.createElement("li");
              li.innerText = e.user + ": "+e.msg;
              viewers.appendChild(li);
            };
            document.body.appendChild(btn);
        
            socket.current.emit("register as viewer", {room: roomNumb.current, name:currentUser.username});
          }
    }





    return (
        <>
        <Header></Header>
        <Content>
            <>
            {!roomSelected ? 
            <div id="selectRoom">
                <label htmlFor="roomNumber">Type the room number</label>
                <input id="roomNumber" type="text" onChange={(e)=>{roomNumb.current=e.target.value}} />
                <button id="joinBroadcaster" onClick={()=>handleClickBroadcaster()}>Join as Broadcaster</button>
                <button id="joinViewer" onClick={()=>handleClickViewer()}>Join as Viewer</button>
            </div>
            :
            <div id="consultingRoom">
                <video autoPlay id="myVideo"></video>
                <p id="broadcasterName">{currentUser.username} is broadcasting...</p>
                <ul id="viewers"></ul>
            </div>

            }
            

            

            </>
        </Content>
        </>
        
    );




}

export default Live;