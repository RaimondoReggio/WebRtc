
const socketioJwt = require('socketio-jwt');

const jwks = require('jwks-rsa');
const jwt = require('jsonwebtoken');

const express = require('express');
const http = require('https');
const cors = require('cors');
var fs = require('fs');
const port = 4000;
const socket = require("socket.io");

var privateKey  = fs.readFileSync('./certificate/key.pem');
var certificate = fs.readFileSync('./certificate/certificate.pem');

var credentials = {key: privateKey, cert: certificate};

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(
    cors({
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    })
);

const server = http.createServer(credentials, app);

server.listen(port ,()=>{
    console.log(`Server connected successfully on Port  ${port}.`);
});

const io = socket(server,{
    cors:{
       origin: true,
        Credential:true,     
    }}
);

const {checkIfUserExist, createUser, createMessage, getUserData, getContacts, getAllMessages, getPossibleUsers, addContact, updateUserProfile,getUsersInfo} = require('./modules/dbinterface');
const {jwtCheck} = require('./modules/jwt');
const { Console } = require('console');

// Return an error message if the jwt isn
app.use(jwtCheck, function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        
        res.status(401).send('invalid token...');
    }
});



// Checks if user exist
app.get('/checkIfUserExist', async(req, res) => {
    const user_id = req.auth.sub;

    const result = await checkIfUserExist(user_id);

    res.json({isRegistered: result});
});

// Registers user on MongoDb
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

// Get user data
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

app.get('/getStrangerData', async(req, res) => {

    const stranger_id = req.query.user_id;

    const result = await getUserData(stranger_id);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get user data");
    }
});

app.get('/getContacts', async(req, res) => {

    const user_id = req.auth.sub; 

    const result = await getContacts(user_id);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get contacts");
    }
});

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
    console.log(to);
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

    if(result) {
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

app.get('/getPossibleLives', async(req, res) => {

    const user_id = req.auth.sub; 
    const learn_lang = req.query.native_l;

    var filtered = Object.keys(broadcasters).reduce(function (filtered, key) {
        if (broadcasters[key].native_l === learn_lang) filtered[key] = key;
        return filtered;
    }, {});

    if(filtered){
        var result = await getUsersInfo(Object.keys(filtered));
        if(result) {
            res.json(result);
        } else {
            res.send("Unable to retrive lives info");
        }
    }else{
        res.send("Unable to get possible lives");
    }
});


const socketJWTCheck = socketioJwt.authorize({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-bswl63fq86v48oa2.eu.auth0.com/.well-known/jwks.json'
    }),
    handshake: true,
    auth_header_required: true
});


io.use(socketJWTCheck, (req,res) => {
    console.log('prova');
});



let onlineUsers = new Map(); // Chat
let broadcasters = {}; // Live
let liveUsers = {}; // Live

io.on("connection",(socket)=>{

    
    var token = socket.handshake.headers.authorization;
    token = token.substring(7, token.length);
    var decoded = jwt.decode(token, {complete: true});
    socket.realUserId = decoded.payload.sub; 
    //estraggo dal jwt l'id auth0|xxxxxxxx e lo setto 
    
    
    if(socket.handshake.query.type==="live"){


        socket.on("register as broadcaster", function (room, native_l) {
            //console.log("reg as broad: " + room +", real: " + socket.realUserId);
            //room è auth0 id mandato dal client
            if(room===socket.realUserId){
                console.log("register as broadcaster for room " + room + ", native_l " + native_l);
                broadcasters[room] = {socketId: socket.id, native_l: native_l};
                socket.isBroadcaster = true;
                socket.room = room;

                socket.join(room); 
            }

            
          });
        
          socket.on("register as viewer", function (user) {
            console.log("register as viewer for room", user.room);
        
            socket.join(user.room);
            user.id = socket.id;
            socket.room = user.room;

            if(liveUsers[user.room]) {
                socket.emit("old users", liveUsers[user.room]); // Send list of users in the same room to the socket's user
            }

            if(!liveUsers[user.room]) {
                liveUsers[user.room] = [];
            }

            liveUsers[user.room].push(user); // Stores all users in a room
            console.log(broadcasters[user.room]);
            socket.to(broadcasters[user.room].socketId).emit("new viewer", user); // Used to establish connection beetween viewer and broadcaster
            socket.to(user.room).emit("add new viewer", user); // Send the new user to everyone except socket's user
          });
        
          socket.on("candidate", function (id, event) {
            socket.to(id).emit("candidate", socket.id, event);
          });
        
          socket.on("offer", function (id, event) {
            event.broadcaster.id = socket.id;
            socket.to(id).emit("offer", event.broadcaster, event.sdp);
          });
        
          socket.on("answer", function (event) {
            //console.log(event.room); da undifined
            console.log(broadcasters[event.room]);
            socket.to(broadcasters[event.room].socketId).emit("answer", socket.id, event.sdp);
          });
        
          socket.on("liveMsg", function (event) {
            //console.log("liveMsg: " +  event);
            //console.log("liveMsg2" + socket.room);
            //event.room
            socket.to(socket.room).emit("liveMsg", event.msg, event.user, event.avatar);
          });

          socket.on("disconnect", function() {
            if(!socket.isBroadcaster && liveUsers[socket.room]) {
                liveUsers[socket.room] = liveUsers[socket.room].filter(item => item.id != socket.id);
            }

            if(socket.isBroadcaster) {
                console.log('broad-disc');
                socket.to(socket.room).emit("broadcaster disconnected");
                delete broadcasters[socket.room];
            } else {
                console.log('user-disc')
                socket.to(socket.room).emit("remove viewer", liveUsers[socket.room]);
            }

            socket.leave(socket.room);

          });



    }else if(socket.handshake.query.type==="chat"){ // if(socket.handshake.query.myParam==="chat")
        
        socket.on("add-user",(userId)=>{
            if(userId===socket.realUserId){
                console.log("adduser "+ userId + "," + socket.realUserId +", " + socket.id);
                onlineUsers.set(userId,socket.id);
                socket.userId = userId;
            }
            
        });
    
        socket.on("send-msg",(data)=>{
            if(data.from===socket.realUserId){
                console.log(data);
                console.log(onlineUsers);
                console.log("send-msg "+ data.from + "," + socket.realUserId);
                const sendUserSocket = onlineUsers.get(data.to);
                if(sendUserSocket){
                    socket.to(sendUserSocket).emit("msg-receive",data);
                }
            }

            
        });
        
        socket.on("disconnect", function() {

            onlineUsers.delete(socket.userId);
            console.log(onlineUsers);

          });
    }
    //global.chatSocket = socket;

    
});
 
