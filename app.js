//Express web server that listens to incoming HTTP requests.
const express = require('express');
const app = express();

const http = require('http');

//allow express to handle the HTTP requests.
const server = http.createServer(app); 
const Server = require("socket.io");
const io = Server(server);

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
const Qwirkle = require("./game/qwirkle")
const rList = {};

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

io.on('connection', function (socket) {  
  socket.on('create-room', username => {
    // Generate unique ID, and join to room. Return ID to room.
    let roomID = uuid.v4().replace(/-/g, '');
    socket.join(roomID);

    rList[roomID] = new Qwirkle(username);
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
      
      // Query which players are in the current channel. 
      // Update room info.
      io.to(gameID).emit('update-player-list', playerCount);
    }
    // If more than 4 players don't connect and send him outside.
    else {

    }
  });

  socket.on('ready', data =>{
    const {gameID, playerID} = data;
    io.to(gameID).emit('update-player-status', playerID);
  });

  // Implement Unready
  let tileArray = [];
  socket.on('start-game', data =>{
    const {gameID, playerID} = data;
    // Add check for readiness later
    let allPlayersReady = true;
    for (let i in rList[gameID].players){
      io.to(gameID).emit('test');
    }
    
    if (!rList[gameID].start){
      rList[gameID].startGame();
      console.log(rList[gameID].players);
      
      io.to(gameID).emit('init-scoreboard');

      for (let i in rList[gameID].players){
        console.log("Player ID: " + playerID);
        console.log(i + ": " + rList[gameID].players[i]);

        for (let j = 0; j < 6; j++){
          tileArray.push(rList[gameID].dealTile());
        }
        io.to(gameID).emit('draw-tile', {target: rList[gameID].players[i], tileArray: tileArray});
      }
    }
  })

  socket.on('tile-swap',data =>{
  const {gameID, playerID, shape,color} = data;
  
  console.log(`gameID: ${gameID}, playerID: ${playerID}, shape:${shape}, color: ${color}`);
  console.log("TILEARRAY");
  const colorNum = rList[gameID].getColorIndex(color);
  const shapeNum = rList[gameID].getShapeIndex(shape);
  const tileNum = parseInt(""+colorNum+shapeNum);
  rList[gameID].deck.push(tileNum);
  const tileIndex = tileArray.indexOf(tileNum);
  if (tileIndex > -1) {
    tileArray.splice(tileIndex, 1);
  }

  tileArray.push(rList[gameID].dealTile());
  socket.emit('draw-single-tile',{target:playerID, tile: tileArray[tileArray.length - 1]});
  console.log(tileArray);
  


    // for (let i in rList[gameID].players){
    //   console.log("Player ID: " + playerID);
    //   console.log(i + ": " + rList[gameID].players[i]);

    //   let tileArray = [];
    //   for (let j = 0; j < 6; j++){
    //     tileArray.push(rList[gameID].dealTile());
    //   }
    //   io.to(gameID).emit('draw-tile', {target: rList[gameID].players[i], tileArray: tileArray});
    // }
})

  socket.on('play-tile', data =>{
    const {gameID, tile, coord} = data;
    const {x, y} = coord;
    rList[gameID].playTile(tile, x, y);

  });

  socket.on('disconnect', function () {
    //console.log('user disconnected');
  });

  socket.on('deal-tile', data =>{
    const {gameID, playerID} = data
    io.to(gameID).emit('deal-tile', {playerID});

  });

});



module.exports = server;