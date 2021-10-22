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

//const room = {playerList: [], playerScore: []}
//interface roomData {[key: roomID] : room};

//
app.use(session({
  secret: process.env.SESSION_KEY || "testsession",
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
  //console.log('a user connected');
  
  socket.on('create-room', arg => {
    // Generate unique ID, and join to room. Return ID to room.
    let roomID = uuid.v4();
    console.log('ROOMID: '+roomID);
    
    socket.join(roomID);
    //roomData.roomID;

    io.to(roomID).emit('room-created', roomID);
  });

  //socket.to().emit();

  // Left to be done: 
  //  Reject connection if it doesn't exist or 4 players in room.
  //  Actually update page with proper values.
  socket.on('join-room', data => {
    const {gameID, username} = data;
    //roomData.roomID
    // Check that there are less than 4 players
    const clients = io.sockets.adapter.rooms.get(gameID);
    let playerCount = clients ? clients.size : 0;

    if (playerCount < 4){
      socket.join(gameID);
      playerCount++;

      socket.emit('room-joined', {id: gameID, count: playerCount});
      //io.to(gameID).emit('room-joined', {id: gameID, count: playerCount});
      //console.log(`There are ${playerCount} players in the room`);
      
      // Query which players are in the current channel. 
      // Update room info.
      io.to(gameID).emit('update-player-list', playerCount);
    }
    // If more than 4 players don't connect and send him outside.
    else {

    }
  });

  socket.on('ready', data =>{
    const {gameID, playerID} = data
    //console.log(`Player ${playerID} has pressed Ready`);
    io.to(gameID).emit('update-player-status', playerID);
  })

  socket.on('disconnect', function () {
    //console.log('user disconnected');
  });

});



module.exports = server;