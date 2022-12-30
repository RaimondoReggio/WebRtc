const express = require('express');
const http = require('https');
const cors = require('cors');
var fs = require('fs');
const port = 4000;
const socket = require("socket.io");

var privateKey  = fs.readFileSync('C:/Windows/System32/cert.key', 'utf8');
var certificate = fs.readFileSync('C:/Windows/System32/cert.crt', 'utf8');

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

const {checkIfUserExist, createUser, createMessage, getUserData, getContacts, getAllMessages} = require('./modules/dbinterface');
const {jwtCheck} = require('./modules/jwt');

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
    } = req.query;

    var message = "Unsuccessfull registration";

    const result = await createUser(user_id, first_name, last_name, username, native_l, new_l, gender, birth_date, birth_country, job, biography, avatar_image);

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

app.get('/getContacts', async(req, res) => {

    const user_id = req.auth.sub; 

    const result = await getContacts(user_id);

    if(result) {
        res.json(result);
    } else {
        res.send("Unable to get contacts");
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

    const result = createMessage(message, user_id, to);

    if(result) {
        res.send("Message created");
    } else {
        res.send("Unable to create messages");
    }
});

global.onlineUsers = new Map();

io.on("connection",(socket)=>{

    global.chatSocket = socket;

    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive",data);
        }
    });
});
 
