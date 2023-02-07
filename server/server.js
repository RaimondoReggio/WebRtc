


const jwks = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const http = require('https');
const express = require('express');
const cors = require('cors');
var fs = require('fs');
const socket = require("socket.io");

const port = 4000;

var privateKey  = fs.readFileSync('./certificate/key.pem');
var certificate = fs.readFileSync('./certificate/certificate.pem');

var credentials = {key: privateKey, cert: certificate};

// Istanzia app express
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    cors({
      origin: 'https://localhost:3000',
      methods: ["GET", "POST"],
      credentials: true,
    })
);

// Istanzia server 
const server = http.createServer(credentials, app);

server.listen(port ,()=>{
    console.trace(`Server connected successfully on Port  ${port}.`);
});

// Istanzia socket.io
const io = socket(server,{
    cors:{
       origin: 'https://localhost:3000',
        Credential:true,     
    }}
);

const {checkIfUserExist, createUser, createMessage, getUserData, getContacts, getAllMessages, getPossibleUsers, addContact, updateUserProfile,getUsersInfo,reduceUserPoints, addUserPoints} = require('./modules/dbinterface');
const {jwtCheck} = require('./modules/jwt');
const { Console } = require('console');

// Fa validare il JWT per ogni end-point
app.use(jwtCheck, function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        
        res.status(401).send('invalid token...');
    }
});

// API
//req.auth.sub è relativo all'id utente auth0!xxxxxx...

app.get('/checkIfUserExist', async(req, res) => {
    const user_id = req.auth.sub;

    const result = await checkIfUserExist(user_id);

    res.json({isRegistered: result});
});

app.post('/registerUser', async(req, res) => {

    const user_id = req.auth.sub; 

    const {
        first_name,
        last_name,
        username, 
        native_l, 
        new_l,
        gender,
        birth_date,
        birth_country,
        job,
        biography,
        avatar_image, 
        email,
        goals,
        hobbies,
    } = req.query;

    var message = "Unsuccessfull registration";

    const result = await createUser(user_id, first_name, last_name, username, native_l, new_l, gender, birth_date, birth_country, job, biography, avatar_image, email, goals, hobbies);

    if(result) {
        message = "Successfull registration"
    }

    res.json({registered: result, message: message});
});

// Restituisce informazioni relative all'utente
app.get('/getUserData', async(req, res) => {

    const user_id = req.auth.sub; 

    const result = await getUserData(user_id);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get user data");
    }
});

app.post('/updateUserProfile', async(req, res) => {

    const user_id = req.auth.sub; 

    const {
        first_name,
        last_name,
        username, 
        native_l, 
        new_l,
        gender,
        birth_date,
        birth_country,
        job,
        biography,
        avatar_image, 
        email,
        goals,
        hobbies,
    } = req.query;

    var message = "Unsuccessfull registration";

    const result = await updateUserProfile(user_id, first_name, last_name, username, native_l, new_l, gender, birth_date, birth_country, job, biography, avatar_image, email, goals, hobbies);

    if(result) {
        message = "Successfull registration"
    }

    res.json({registered: result, message: message});
})

// Restituisce informazioni relative ad un contatto
app.get('/getStrangerData', async(req, res) => {

    const stranger_id = req.query.user_id;
    const result = await getUserData(stranger_id);
    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get user data");
    }
});

// Restituisce i contatti attuali dell'utente
app.get('/getContacts', async(req, res) => {

    const user_id = req.auth.sub; 

    const result = await getContacts(user_id);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get contacts");
    }
});

// Restituisce i possibili nuovi contatti dell'utente in base alla lingua
app.get('/getPossibleUsers', async(req, res) => {

    const user_id = req.auth.sub; 

    const result = await getPossibleUsers(user_id);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get possible users");
    }
});

app.post('/getAllMsgs', async(req, res) => {

    const user_id = req.auth.sub; 
    const {to} = req.query; 
    console.trace(to);
    const result = await getAllMessages(user_id, to);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get messages");
    }

});

app.post('/addMsg', async(req, res) => {

    const user_id = req.auth.sub; 
    const {to, message} = req.query;
    
    const result = await createMessage(message, user_id, to);
    // messaggiando con un utente si incrementano i suoi punti
    const result_ = await addUserPoints(to, 0.2);

    if(result && result_) {
        res.send("Message created");
    } else {
        res.send("Unable to create messages");
    }
});

app.post('/addContact', async(req, res) => {

    const user_id = req.auth.sub; 
    const {contact_id} = req.query;

    const result1 = await addContact(user_id, contact_id);
    const result2 = await addContact(contact_id, user_id);

    if(result1 && result2) {
        res.send("Contact added");
    } else {
        res.send("Unable to add contact");
    }
});

// Restituisce le live a cui può accedere l'utente in base alla lingua
app.get('/getPossibleLives', async(req, res) => {

    const user_id = req.auth.sub; 
    const learn_lang = req.query.native_l;

    var filtered = Object.keys(broadcasters).reduce(function (filtered, key) {
        if (broadcasters[key].native_l === learn_lang) filtered[key] = key;
        return filtered;
    }, {});

    if(filtered){

        var result = await getUsersInfo(Object.keys(filtered));

        result.forEach(item => {
            item.roomName = broadcasters[item.id].roomName;
            item.roomDescr = broadcasters[item.id].roomDescr;
        });
        console.trace(result);

        if(result) {
            res.json(result);
        } else {
            res.send("Unable to retrive lives info");
        }
    }else{
        res.send("Unable to get possible lives");
    }
});


// SOCKET.IO

// Fa validare il JWT per ogni nuova connessione
const socketJWTCheck = socketioJwt.authorize({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-ipebb6rgmf8hkbyz.us.auth0.com/.well-known/jwks.json'
    }),
    handshake: true,
    auth_header_required: true
});

io.use(socketJWTCheck, (req,res) => {
    
});



let onlineUsers = new Map(); // Chat, {id1_auth0: socket1.id, ...}
let broadcasters = {}; // Live, {room1: {socketId: socket.id, native_l: native_l, ....}, room2:{..}}
let liveUsers = {}; // Live, {room1: [user1, user2,..], room2: [..]}
let countLiveUsers = {}; //Live, {room1: x, room2: y, ..}

io.on("connection",(socket)=>{

    // Estrae JWT per ottenre id_auth0
    var token = socket.handshake.headers.authorization;
    token = token.substring(7, token.length);
    var decoded = jwt.decode(token, {complete: true});
    socket.realUserId = decoded.payload.sub; //id_auth0


    // Se si tratta di una socket relativa alla chat tra utenti
    if(socket.handshake.query.type==="chat"){
        
        socket.on("add-user",(userId)=>{
            if(userId===socket.realUserId){ // Controllo se l'id ricevuto è lo stesso del token, da rimuovere in futuro
                console.trace("adduser "+ userId + "," + socket.realUserId +", " + socket.id);
                onlineUsers.set(userId,socket.id); // Aggiunta utente agli utenti online
                socket.userId = userId;
            }  
        });
    
        socket.on("send-msg",(data)=>{
            if(data.from===socket.realUserId){ 
                console.trace(data);
                console.trace(onlineUsers);
                console.trace("send-msg "+ data.from + "," + socket.realUserId);
                const sendUserSocket = onlineUsers.get(data.to); // Estraggo la socket.id del destinatario
                if(sendUserSocket){ // Se è online
                    socket.to(sendUserSocket).emit("msg-receive",data);
                }
            }
        });
        
        socket.on("disconnect", function() {
            onlineUsers.delete(socket.userId);
            console.trace(onlineUsers);
          });
    }

    // Se si tratta di una socket relativa ai commenti di una live
    else if(socket.handshake.query.type==="live"){

        // Il client si registra come broadcaster
        socket.on("register as broadcaster", function (room, native_l, roomName, roomDescr) {
            // Per l'id della live(room) viene usato l'id_auth0 del broadcaster
            
            if(room===socket.realUserId && !broadcasters[room]){//Se gli id corrispondono e non esiste già una stanza creata dall'utente(broadcaster)

                socket.join(room);

                console.trace("register as broadcaster for room " + room + ", native_l " + native_l);

                broadcasters[room] = {socketId: socket.id,
                             native_l: native_l, roomName: roomName, roomDescr:roomDescr}; // Aggiunge info della stanza

                socket.isBroadcaster = true;
                socket.room = room; // ridondante, è uguale a socket.realUserId === socket.realId
                countLiveUsers[room] = 0;
            }
          });
        
          // Il client si registra come Viewer
          socket.on("register as viewer", async function (user) {

            console.trace(broadcasters[user.room]);

            if(user.userId === socket.realUserId){
                if(broadcasters[user.room]) // Se la live esiste
                {
                    // Controlla se il Viewer ha abbastanza punti
                    const canJoin = await reduceUserPoints(socket.realUserId);
                    if(!canJoin){
                        socket.emit("not enough points", user.room);
                        console.trace("nun ten sord " + socket.realUserId);
                    }else{
                        
                        socket.join(user.room);
                        socket.isViewer = true;

                        console.trace("register as viewer for room", user.room);

                        user.id = socket.id; //id socket
                        socket.room = user.room;
        
                        if(liveUsers[user.room]) { // Se la stanza esiste, si invia all'utente la lista degli utenti già presenti
                            socket.emit("old users", liveUsers[user.room]);
                        }else if(!liveUsers[user.room]) { 
                            liveUsers[user.room] = [];

                        }
                        //user.id = socket.id, user.userId = id auth0
                        liveUsers[user.room].push(user); // Aggiunge l'utente
                        console.trace(broadcasters[user.room]);
        
                        // Si segnala al Broadcaster l'aggiunta di un nuovo Viewer, cosi da dare inizio al SIGNALING (1)
                        socket.to(broadcasters[user.room].socketId).emit("new viewer", user); 
                        // Si segnala anche agli utenti già in live
                        socket.to(user.room).emit("add new viewer", user); 
                    }
                }else{
                    socket.emit("room not exist", user.room);   
                }
            }else{
                console.trace("utente malevolo " + user.userId + ", real " + socket.realUserId);
            }
            
          });

          // VIEWER <=> BROADCASTER 
          // Evento inviato sia da Viewer che da Broadcaster
          // per comunicare all'altro peer un proprio ICE Candidate
          socket.on("candidate", function (id, event) {
            if(socket.isViewer && broadcasters[socket.room].socketId === id){ //sto inviando al broadcaster della stanza scelta all'inizio
                socket.to(id).emit("candidate", socket.id, event);
            }else if(socket.isBroadcaster && liveUsers[socket.room].some(obj => obj.id === id)){//sto inviando ad un viewer nella mia stanza
                socket.to(id).emit("candidate", socket.id, event);
            }
          });
        
          // VIEWER <= BROADCASTER (2)
          socket.on("offer", function (id, event) {
            //id = socket.id del client
            if(socket.isBroadcaster && event.broadcaster.room === socket.room //se il broadcast sta facendo un offerta per la sua stanza
                && liveUsers[socket.room].some(obj => obj.id === id)){ //se l'utente a cui si vuole mandare l'offer ne aveva fatto richiesta

                event.broadcaster.id = socket.id; // nella offer vengono mandate info del broadcaster
                socket.to(id).emit("offer", event.broadcaster, event.sdp); 
            }
          });
        
          // VIEWER => BROADCASTER (3)
          socket.on("answer", function (event) { 
            if(socket.isViewer && socket.room===event.room){ //è possibile inoltrare answer solo al broadcaster della stanza in cui si è viewer
                //incrementa counter stanza
                countLiveUsers[socket.room] = countLiveUsers[socket.room] + 1;

                console.trace(broadcasters[socket.room]);
                socket.to(broadcasters[socket.room].socketId).emit("answer", socket.id, event.sdp);
            }
          });
        
          // VIEWER => ROOM(LIVE)
          socket.on("liveMsg", function (event) {
            if(socket.isViewer){
                socket.to(socket.room).emit("liveMsg", event.msg, event.user, event.avatar);
            }
          });

          socket.on("disconnect", async function() {
            
            if(socket.isBroadcaster) {
                console.trace('broad-disc');

                socket.to(socket.room).emit("broadcaster disconnected");
                socket.leave(socket.room);

                delete broadcasters[socket.room];
                delete liveUsers[socket.room]; 
                
                const to_inc = countLiveUsers[socket.room];
                const result = await addUserPoints(socket.realUserId, to_inc);
                // Il Broadcaster guadagna un punto per ogni utente che ha partecipato
                console.trace(result);

            } else if(socket.isViewer){
                socket.isViewer = false;
                console.trace('user-disc')
                if(!socket.isBroadcaster && liveUsers[socket.room]) { // Si rimuove l'utente dai partecipanti della live
                    liveUsers[socket.room] = liveUsers[socket.room].filter(item => item.id != socket.id);
                }
                socket.to(socket.room).emit("remove viewer", liveUsers[socket.room]);
                socket.leave(socket.room);
            }

          });

    }
    
});
 
