//Express web server that listens to incoming HTTP requests.
const express = require("express");
const app = express();

const http = require("http");

//allow express to handle the HTTP requests.
const server = http.createServer(app);
const Server = require("socket.io");
const io = Server(server);

const exphbs = require("express-handlebars");

const bodyParser = require("body-parser");

//Can help store user data between http requests
const session = require("express-session");

//express.js registers handlebars as its Template Engine (Handlebars)
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//load the enviornment varible file
require("dotenv").config({ path: "./config/keys.env" });

//parse application/x-www-form-urlencoded
//allows you to use req.body.(property name)
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//load static resources(assests)
app.use(express.static("public"));

//load each controller
const generalController = require("./controllers/general_routes");
const userController = require("./controllers/user_routes");
const gameController = require("./controllers/game_routes");

// Used to store all current rooms
const uuid = require("uuid");

//const room = {playerList: [], playerScore: []}
//interface roomData {[key: roomID] : room};
const Qwirkle = require("./game/qwirkle");
const rList = {};

//
app.use(
  session({
    secret: process.env.SESSION_KEY || "testsession",
    resave: false,
    saveUninitialized: true,
    //  cookie: { secure: true }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.userInfo;
  next();
});

/*
    This will allow specific forms and/or links that were submitted/pressed to send
    PUT and DELETE requests
*/
app.use((req, res, next) => {
  if (req.query.method == "PUT") {
    req.method = "PUT";
  } else if (req.query.method == "DELETE") {
    req.method = "DELETE";
  }
  next();
});

//Map each controller to the app object
app.use("/", generalController);
app.use("/user", userController);
app.use("/game", gameController);

io.on("connection", function (socket) {
  socket.on("create-room", (username) => {
    // Generate unique ID, and join to room. Return ID to room.

    let gameID = uuid.v4().replace(/-/g, '');
    socket.join(gameID);

    rList[gameID] = new Qwirkle(username);
    io.to(gameID).emit('room-created', gameID);
  });

  //socket.to().emit();

  // Left to be done:
  //  Reject connection if it doesn't exist or 4 players in room.
  //  Actually update page with proper values.
  socket.on("join-room", (data) => {
    const { gameID, username } = data;
    //roomData.roomID
    // Check that there are less than 4 players
    const clients = io.sockets.adapter.rooms.get(gameID);
    let playerCount = clients ? clients.size : 0;

    if (playerCount < 4) {
      socket.join(gameID);
      playerCount++;

      rList[gameID].addPlayer(username);

      socket.emit('room-joined', { id: gameID, count: playerCount });
      //io.to(gameID).emit('room-joined', {id: gameID, count: playerCount});

      // Query which players are in the current channel.
      // Update room info.
      playerList = rList[gameID].players;
      console.log(playerList);
      io.to(gameID).emit("update-player-list", { gameID, playerList });
    }
    // If more than 4 players don't connect and send him outside.
    else {
    }
  });

  socket.on("ready", (data) => {
    const { gameID, playerID } = data;
    io.to(gameID).emit("update-player-status", playerID);
  });

  // Implement Unready
  socket.on("start-game", (data) => {
    const { gameID, playerID } = data;
    // Add check for readiness later
    let allPlayersReady = true;
    for (let i in rList[gameID].players) {
      io.to(gameID).emit("test");
    }

    if (!rList[gameID].start) {
      rList[gameID].startGame();
      console.log(rList[gameID].players);
      players = rList[gameID].players;
      io.to(gameID).emit('server-start-game', players);

      //io.to(gameID).emit('init-scoreboard', rList[gameID].players.length);

      //io.to(gameID).emit("init-scoreboard");

      for (let i in rList[gameID].players) {
        let tileArray = [];

        for (let j = 0; j < 24; j++) {
          tileArray.push(rList[gameID].dealTile());
        }
        console.log(`Dealing ${tileArray} to ${rList[gameID].players[i]}`);
        io.to(gameID).emit("draw-tile", {
          target: rList[gameID].players[i],
          tileArray: tileArray,
        });
      }
    }
  });

  socket.on("tile-swap", (data) => {
    const { gameID, playerID, tiles } = data;
    //console.log(`gameID: ${gameID}, playerID: ${playerID}, swapTileArray: ${tiles}`);
    //console.log("TILEARRAY");
    //console.log(tileArray);
    // const colorNum = rList[gameID].getColorIndex(color);
    // const shapeNum = rList[gameID].getShapeIndex(shape);
    // const tileNum = parseInt(""+colorNum+shapeNum);
    if (turnCheck(gameID, playerID)) {
      let swappedTiles = [];
      let tileArray = tiles;
      for (let i = 0; i < tiles.length; i++) {
        const tileIndex = tileArray.indexOf(tiles[i]);
        console.log("TILEINDESX: " + tileIndex);
        if (tileIndex > -1) {
          console.log("removing tile");
          tileArray.splice(tileIndex, 1);
        }
        tileArray.push(rList[gameID].dealTile());
        swappedTiles.push(tileArray[tileArray.length - 1]);
      }
      socket.emit("deal-swapped-tiles", { swappedTiles: swappedTiles });

      console.log(rList[gameID].deck);
      console.log(tileArray);
    }
  });

  socket.on('client-end-turn', data => {
    const { gameID, playerID, action } = data;

    if (turnCheck(gameID, playerID)) {
      if (action == "no-more-plays") rList[gameID].noMorePlaySignal();

      let score = rList[gameID].endTurn();
      let endGame = rList[gameID].endGameCheck(false);

      let turnID = rList[gameID].turn;
      let count = rList[gameID].players.length;

      if (endGame) io.to(gameID).emit("server-end-game", { playerID, turnID, count });;

      io.to(gameID).emit("server-end-turn", { playerID, turnID, score, count, endGame });
    }
  })

  socket.on('client-end-play', data => {
    const { gameID, playerID, replenishNum } = data;
    let tileArray = [];

    for (let i = 0; i < replenishNum; i++) {
      tileArray.push(rList[gameID].dealTile());
    }
    io.to(gameID).emit("server-replenish-tile", { playerID, tileArray });
    //socket.emit("deal-swapped-tiles", { swappedTiles: swappedTiles });
  })

  socket.on('client-play-tile', data => {
    const { gameID, playerID, tile, gridCoords, absCoords } = data;
    const { x, y } = gridCoords;

    //console.log(`Playing Tile ${tile} to (${x}, ${y})`);
    if (turnCheck(gameID, playerID) && rList[gameID].playTile(tile, x, y)) {
      io.to(gameID).emit('server-play-tile', { gameID, playerID, tile, gridCoords, absCoords });
    }
  });

  socket.on("disconnect", function () {
    //console.log('user disconnected');
  });

  socket.on("deal-tile", (data) => {
    const { gameID, playerID } = data;
    io.to(gameID).emit("deal-tile", { playerID });
  });
});

function turnCheck(gameID, playerID) {
  let turn = rList[gameID].turn;
  if (rList[gameID].players[turn] == playerID) {
    return true;
  }
  else {
    console.log("Not Your Turn");
    return false;
    io.to(gameID).emit("not-your-turn", { playerID });
  }
}

module.exports = server;
