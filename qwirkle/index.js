/* 
----------------------------------
    Enviornment Setup
----------------------------------
 1. npm init    
 2. npm i express --save
    - push enter for everything
    - answer yes
 3. npm i mongoose --save
 4. npm i dotenv
 5. create config directory in root
    - in the config directory create keys.env file
    - keys.env will be used to store all envirnment varibles (connection strings, usernames, passwords, PORT, etc... )
 6. npm i express-handlebars
 7. npm i express-session --save
 8. npm i npm i socket.io
 9. 
*/

//Express web server that listens to incoming HTTP requests.
const express = require('express');
const app = express();

const http = require('http');

//allow express to handle the HTTP requests.
const server = http.createServer(app); 
const Server = require("socket.io");
const io = Server(server);

const mongoose =require('mongoose'); 
const exphbs= require('express-handlebars');

const bodyParser=require('body-parser');

//Can help store user data between http requests
const session = require('express-session');

//express.js registers handlebars as its Template Engine (Handlebars)
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load the enviornment varible file
require('dotenv').config({path:"./config/keys.env"}); 


//parse application/x-www-form-urlencoded
//allows you to use req.body.(property name)
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//load static resources(assests)
app.use(express.static("public"));

//load each controller
const generalController=require("./controllers/general_routes");
const userController = require("./controllers/user_routes");
const gameController = require("./controllers/game_routes");

// Used to store all current rooms
const uuid = require("uuid");
let roomList = [];

//
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  //  cookie: { secure: true }
  }))

app.use((req,res,next)=>{
  res.locals.user=req.session.userInfo;
  next();
});

/*
    This will allow specific forms and/or links that were submitted/pressed to send
    PUT and DELETE requests
*/
app.use((req,res,next)=>{
  if(req.query.method=="PUT"){
      req.method="PUT";
  }else if(req.query.method=="DELETE"){
      req.method="DELETE";
  }
  next();
});

//Map each controller to the app object
app.use('/', generalController);
app.use('/user',userController);
app.use('/game',gameController);


//Connect to Database
mongoose.connect(process.env.MONGO_DB_CONNECT)
.then(()=>{
    console.log('Connected to MongoDB')
})
.catch(err=> console.log(`Could not connect to MongoDB: ${err}`));

io.on('connection', function (socket) {
  console.log('a user connected');
  
  socket.on('create-room', arg => {
    // Generate unique ID, and join to room. Return ID to room.
    let roomID = uuid.v4();
    
    socket.join(roomID);
    roomList.push(roomID);

    io.to(roomID).emit('room-created', roomID);
  });

  //socket.to().emit();

  // Left to be done: 
  //  Reject connection if it doesn't exist or 4 players in room.
  //  Actually update page with proper values.
  socket.on('join-room', roomID => {
    // Check that there are less than 4 players
    let playerCount = io.sockets.adapter.rooms.get(roomID).size;
    socket.join(roomID);

    io.to(roomID).emit('room-joined', roomID);
    console.log(`There are ${playerCount} players in the room`);
  
    // Update room info.

  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});


server.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
  console.log(`Example app listening at ${server.address().port}`);
});