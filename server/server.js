const express = require('express');
const http = require('http');
const cors = require('cors');
const port = 4000;

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

const {checkIfUserExist, createUser} = require('./modules/dbinterface');
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

    const {native_l, new_l} = req.query;  
    const username = req.query.username;
    var message = "Unsuccessfull registration";

    const result = await createUser(user_id, username, native_l, new_l);

    if(result) {
        message = "Successfull registration"
    }

    res.json({registered: result, message: message});
});

 
app.listen(port);
