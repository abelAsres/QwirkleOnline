/*width: window.innerWidth, height: window.innerHeight*/
const app = new PIXI.Application({
  width: 1200,
  height: 1300,
  backgroundColor: 0xD3D3D3,
});
const grid = new PixiJSGrid(1240, 40);
const socket = io();

var playerList = [];
let gameID; // = document.getElementById('copy-invite-button').innerText;
var playerID = ""; // Temporary variable, will be replaced with username when it becomes available.
var playerNum; 
let playerCount;
//let playerStatus = false; 

let yPositon = 1250;
let xPosition = 0;
let boardX;
let boardY;

let boardPlay = false;
let selectedColor = [];
let selectedShape = [];
const colors = ["Yellow", "Blue", "Red", "Orange", "Purple", "Green"];
const shapes = ["Circle", "Cross", "Diamond", "Square", "Star", "Triangle"];

let swap = false;
let line;
let selectedTile = PIXI.Sprite();
let swapTileArray = [];
let playTileArray = [];

function CopyToClipboard() {
  /* Get the text field */
  var copyText = document.getElementById("copy-invite-button");

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.href);

  /* Alert the copied text */
  alert("Copied the text: " + copyText.href);
}

$(document).ready(function () {
  playerID = document.getElementById("userName").innerText;
  gameID = document.getElementById("gameID").innerText;

  history.pushState(null, "", location.href.split("/join?")[0]);

  // Draw and display the Grid (PixiJS App).
  $("#game-app").append(app.view);
  
  let g = new PIXI.Graphics();
  g.beginFill(0x000000);
  g.lineStyle(1, 0x000000);
  g.drawRect(600, 600, 40, 40);
  app.stage.addChild(g);

  grid.lineStyle({ width: 1, color: 0x000000 });
  grid.drawGrid();
  app.stage.addChild(grid);

  // Check if user came through the create button or joined.
  if (gameID == undefined || gameID == "") {
    socket.emit("create-room", playerID);
    UpdatePlayerList(1);
    playerNum = 1;
  }
  // When the else fires. Client will emit a request that adds them to the room.
  // The server will respond with an emit to all current players updating player list
  else {
    socket.emit("join-room", { gameID: gameID, username: playerID });
  }
});

socket.on("room-created", (id) => {
  gameID = id;

  //Update fields with generated game room info
  //document.getElementById('copy-invite-button').innerText = gameID;
  document.getElementById("copy-invite-button").href =
    "/game/join?id=" + gameID;

  $("#copy-invite-button").append();
  //console.log(`Player ${playerID} has created game #${gameID}`);
});

// Should update page info to reflect current status.
socket.on("room-joined", (data) => {
  const { id, count } = data;
  // Update player list.
  playerNum = count;
  //console.log(`Player ${playerNum} has joined game #${gameID}`);
});

socket.on('server-start-game', (players) => {
  // Remove all lobby display elements. 
  document.getElementById("title-gamepage").style = "display: none";
  document.getElementById("gInvite").style = "display: none";
  document.getElementById("startBtns").style = "display: none";
  document.getElementById("gPList").style = "display: none";

  document.getElementById("game-app").style = "display: block";
  document.getElementById("gameBtns").style = "display: block";

  initScoreboard(players);
  
  //document.body.style.zoom = "75%"
  grid.on("mousedown", playTile);
});

function initScoreboard(playerList){
  count = playerList.length;
  let scoreboard = document.getElementById("scoreboard");
  let table = document.createElement("table");
  table.setAttribute('id', 'table-score');

  let tbdy = document.createElement("tbody");
  let tr = document.createElement('tr');

  for (let i = 0; i < count; i++){
    let td = document.createElement('td');
    td.appendChild(document.createTextNode(playerList[i]));
    td.setAttribute('id', `player-${i}`)
    
    if (i == 0) {
      td.style.color = "red";
      td.style.fontWeight = "bold";
    }

    tr.appendChild(td);
  }
  
  tbdy.appendChild(tr);
  tr = document.createElement('tr');

  for (let i = 0; i < count; i++){
    let td = document.createElement('td');
    td.appendChild(document.createTextNode("0"));
    td.setAttribute('id', `score-${i}`)
    tr.appendChild(td);
  }

  tbdy.appendChild(tr);
  table.appendChild(tbdy);

  // Styling
  table.setAttribute('border', '1');

  scoreboard.appendChild(table);
}

socket.on('ready-status', (data) => {

})

function startGame(){
    console.log('Start game has been pressed');
    socket.emit('start-game', {gameID: gameID, playerID: playerID});
}

//
socket.on("update-player-list", data => {
  const {gameID, playerList} = data;
  UpdatePlayerList(playerList);
});

// Currently incomplete
function UpdatePlayerList(playerList) {
  console.log(playerList);
  for (let i = 1; i <= playerList.length; i++) {
    $("#player-" + i).replaceWith("<td id=player-" + i + ">" + playerList[i - 1] + "</td>");
    $("#player-" + i + "S").replaceWith("<td id=player-" + i + "S>Not Ready</td>");
  }
}

socket.on('server-end-turn', (data) => {
  const {playerID, turnID, score, count, endGame} = data;
  
  if (endGame);
  else endOfTurnUpdate(turnID, score, count);
});

function endOfTurnUpdate(turnID, score){
  console.log(`Turn ID is ${turnID}... Score is ${score}... Count is ${count}`);

  for (let i = 0; i < count; i++){
    if (i != turnID){
      let p = document.getElementById("player-" + i);
      p.style.color = "black";
      p.style.fontWeight = "normal";
    }
    else {
      let p = document.getElementById("player-" + turnID);
      p.style.color = "red";
      p.style.fontWeight = "bold";
      let s = document.getElementById(`score-${turnID}`);
      s.innerText = score;
    }
  }
}

socket.on("server-replenish-tile", (data)=>{
  const {playerID, tileArray} = data;
  if (this.playerID == playerID){
    for (let i = 0; i < tileArray.length; i++){
      xPosition = playTileArray[i].x;
      yPosition = playTileArray[i].y;

      getSingleTile(tileArray[i]);
    }

    playTileArray = [];
    socket.emit("client-end-turn", {gameID, playerID, actions: "play-tile"});
  }
});

function noMoreMoves(){
  socket.emit("client-end-turn", {gameID, playerID, action: "no-more-plays"});
}

function ready() {
  let status = updatePlayerStatus();
  if (status) {
    socket.emit("ready", { gameID: gameID, playerID: playerNum });
  } else {
      socket.emit("unready", { gameID: gameID, playerID: playerNum });
  }
}

socket.on("update-player-status", (playerNum) => {
  console.log(`Player ${playerNum} is ready`);
  $("#player-" + playerNum + "S").replaceWith(
    "<td id=&quot;player-" + playerNum + "S&quot;>Ready</td>"
  );
});

socket.on('server-play-tile', data =>{
    const {playerID, tile, gridCoords, absCoords} = data;
    //playTileArray.push(tile, gridCoords);

    if (this.playerID == playerID)
      placeSelectedTile2(absCoords.x, absCoords.y);
    else{
      console.log("Other Player Display");
      placeSelectedTile3(tile, absCoords.x, absCoords.y);
    }
});

function playTile(e){
    let tile = tileENUM2(selectedTile.shape, selectedTile.color);
    let mouseCoords = e.data.global;
    let absCoords = {x: mouseCoords.x, y: mouseCoords.y}
    let gridCoords = grid.getCellCoordinates(mouseCoords.x, mouseCoords.y);

    console.log(`Playing tile ${tile} to ${gridCoords.x}, ${gridCoords.y}`);
    socket.emit('client-play-tile', {gameID, playerID, tile, gridCoords, absCoords})
}

function placeSelectedTile3(tile, x, y){
  let pos = grid.getCellCorner(x, y);
  boardPlay = true;
  selectedColor = [];
  selectedShape = [];
  selectedShape.push(tile % 10);
  selectedColor.push(Math.floor(tile / 10));

  boardX = pos.x;
  boardY = pos.y;

  loader.load(drawTile);
  boardPlay = false;
}

function placeSelectedTile2(x, y){
  let pos = grid.getCellCorner(x, y);
  console.log(pos);
  playTileArray.push({x: selectedTile.x, y: selectedTile.y});

  selectedTile.x = pos.x;
  selectedTile.y = pos.y;
  app.stage.removeChild(line);
  selectedTile.alpha = 1;
  selectedTile.interactive = false;
  selectedTile = PIXI.Sprite();
}

function tileENUM2(shape, color){
    //console.log(`Shape is ${shape} and Color is ${color}`);

    let ret;

    if (color == 'Yellow') ret = 0;
    else if (color == 'Blue') ret = 10;
    else if (color == 'Red') ret = 20;
    else if (color == 'Orange') ret = 30; 
    else if (color == 'Purple') ret = 40;
    else if (color == 'Green') ret = 50;

    if (shape == 'Circle') ret += 0;
    else if (shape == 'Cross') ret += 1;
    else if (shape == 'Diamond') ret += 2;
    else if (shape == 'Square') ret += 3;
    else if (shape == 'Star') ret += 4;
    else if (shape == 'Triangle') ret += 5;

    return ret;
}

socket.on('draw-single-tile', data =>{
    const {target, tile} = data; 

    if (playerID == target){
        getSingleTile(tile);
    }
});

socket.on("draw-tile", (data) => {
  const { target, tileArray } = data;

  if (playerID == target) {
    getTile(tileArray);
  }
});

socket.on("draw-single-tile", (data) => {
  const { target, tile } = data;

  if (playerID == target) {
    getSingleTile(tile);
  }
});

socket.on("deal-swapped-tiles", (data) => {
  const { swappedTiles } = data;

  for (let i = 0; i < swappedTiles.length; i++) {
    xPosition = swapTileArray[i].x;
    yPosition = swapTileArray[i].y;
    getSingleTile(swappedTiles[i]);
    app.stage.removeChild(swapTileArray[i]);
  }

  swapTileArray = [];
});


const loader = PIXI.Loader.shared;

const shapesTileSheet = [
  "images/circlespritesheet.json",
  "images/crossspritesheet.json",
  "images/diamondspritesheet.json",
  "images/squarespritesheet.json",
  "images/starspritesheet.json",
  "images/trianglespritesheet.json",
];

function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}

function getSingleTile(tile) {
  selectedColor = [];
  selectedShape = [];
  selectedShape.push(tile % 10);
  selectedColor.push(Math.floor(tile / 10));
  loader.load(drawTile);
}

function getTile(tileArray) {
  PIXI.utils.clearTextureCache();
  for (let i in tileArray) {
    selectedShape.push(tileArray[i] % 10);
    selectedColor.push(Math.floor(tileArray[i] / 10));
  }

  for (let i = 0; i < 6; i++) {
    loader.add(shapesTileSheet[i]);
  }
  loader.load(drawTile);
  console.log("Colors: " + selectedColor);
}

function getTileAtRandom() {
  let colorIdx = Math.floor(Math.random() * 5);
  let shapeIdx = Math.floor(Math.random() * 5);

  selectedColor = colors[colorIdx];
  selectedShape = shapes[shapeIdx];

  console.log(
    `ColorIdx: ${colorIdx} ShapeIdx: ${shapeIdx},${shapesTileSheet[shapeIdx]}`
  );

  if (
    checkTileAvailablity(
      shapes[shapeIdx].toLowerCase(),
      colors[colorIdx].toLowerCase()
    )
  ) {
    loader.add(shapesTileSheet[shapeIdx]);
    loader.load(drawTile);
  } else if (allTilesInPlay) {
    alert("There are no more tiles to be drawn");
  }
}

function drawTile(loader, resources) {
  console.log(resources);
  for (let i in selectedColor) {
    let texture = PIXI.Texture.from(
      `${shapes[selectedShape[i]]}${colors[selectedColor[i]]}Tile.png`
    );
    let sprite = new PIXI.Sprite(texture);
    
    //store color and shape to easily see what the tile features are
    sprite.color = colors[selectedColor[i]];
    sprite.shape = shapes[selectedShape[i]];

    //sprite.eNum is used by game logic to represent tile features
    sprite.eNum = tileENUM2(sprite.shape,sprite.color,);
    sprite.width = 40;
    sprite.height = 40;


    if (boardPlay){
      sprite.position.set(boardX, boardY);
    }
    else {
      sprite.position.set(xPosition, yPositon);
      xPosition += 40;

      sprite.interactive = true;
      sprite.buttonMode = true;
      sprite.anchor.set = 0.5;
      sprite.on("pointertap", tileClicked);
    }

    app.stage.addChild(sprite);
  }
  loader.reset();
}

function intiateSwap() {
  swap = !swap;
  let confirmSwapBtn = document.getElementById("swapTilesBtn");
  let swapButton = document.getElementById("intiateSwapBtn");
  if (swap) {
    confirmSwapBtn.style.display = "inline";
    swapButton.innerHTML = "Cancel Swap";
    if (selectedTile.alpha == 0.5) {
      selectedTile.alpha = 1;
      selectedTile = PIXI.Sprite();
    }
  } else {
    swapTileArray.forEach((tile) => {
      tile.alpha = 1;
    });
    swapTileArray = [];
    confirmSwapBtn.style.display = "none";
    swapButton.innerHTML = "Swap Tiles";
  }
}

function tileClicked(event) {
  if (swap) {
    //if the tile has been selected already remove it from tile selection
    //other wise add it to tile swap selection
    const tileIndex = swapTileArray.indexOf(this);
    //console.log("TILEINDEX: " + tileIndex);
    if (tileIndex > -1) {
      swapTileArray.splice(tileIndex, 1);
      this.alpha = 1;
      //selectedTile = PIXI.Sprite();
    } else {
      this.alpha = 0.5;
      swapTileArray.push(this);
      console.log(this.eNum);
    }

    //console.log(this.shape + this.color);
    // socket.emit('tile-swap',{gameID: gameID, playerID: playerID, tileNum= this.tileNum});
    //getTileAtRandom();
  } else {
    if (selectedTile.alpha == 0.5) {
      selectedTile.alpha = 1;
    }
    selectedTile = this;
    xPosition = selectedTile.x;
    yPositon = selectedTile.y;
    selectedTile.alpha = 0.5;
    //app.stage.removeChild(line);
    //showSelection(this.x, this.y, 0xffea00);
    this.data = event.data;
    console.log(this);
    //app.stage.interactive = true;
    //selectedTile.alpha = 0.5;
    //grid.on("mousedown", playTile);
  }
}

function endTurn(){
  let replenishNum = playTileArray.length;
  if (replenishNum > 0){
    socket.emit("client-end-play", {gameID, playerID, replenishNum});
  }
  else {
    socket.emit("client-end-turn", {gameID, playerID});
  }
}

function swapTiles() {
  if (swapTileArray.length > 0) {
    let tileENums = [];
    swapTileArray.forEach((tile) => {
      tileENums.push(tile.eNum);
    });
    socket.emit("tile-swap", {
      gameID: gameID,
      playerID: playerID,
      tiles: tileENums,
    });
    document.getElementById("swapTilesBtn").style.display = "none";
    document.getElementById("intiateSwapBtn").innerHTML ="Swap Tiles";
    swap = !swap;
    endTurn();
   
  }
}

function placeSelectedTile(e) {
  let pos = e.data.global;
  pos = grid.getCellCorner(pos.x, pos.y);

  selectedTile.x = pos.x;
  selectedTile.y = pos.y;
  app.stage.removeChild(line);
  selectedTile.alpha = 1;
  selectedTile = PIXI.Sprite();
}

// throughout the process multiple signals can be dispatched.
loader.onProgress.add(() => {
  console.log("loader in progress");
}); // called once per loaded/errored file
loader.onError.add(() => {
  console.log("an error");
}); // called once per errored file
loader.onLoad.add(() => {
  console.log("loading resource");
}); // called once per loaded file
loader.onComplete.add(() => {
  console.log("added resource");
  loader.reset();
}); // called once when the queued resources all load.

/*
function setup(loader,resources){
    const colors = ['Yellow','Blue','Red','Orange','Purple','Green'];
    const shapes = ['Circle','Square','Triangle','Star','Diamond','Cross'];
     let xPosition = 0;
     
    for (let i = 0; i < 3; i++){
        for (shape in shapes){
            for (color in colors){
                const texture = PIXI.Texture.from(`${shapes[shape]}${colors[color]}Tile.png`);
                const sprite = new PIXI.Sprite(texture);
    
                sprite.position.set(xPosition,yPositon);
                xPosition+=63;
    
                sprite.interactive = true; 
                sprite.buttonMode = true; 
                sprite.anchor.set = 0.5; 
    
                sprite.on('pointerdown', onDragStart)
                .on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', onDragMove);
    
                app.stage.addChild(sprite);
            }
            yPositon += 63;
            xPosition = 0; 
        }
    }
}
*/


/*function tileENUM(color, shape) {
  console.log("TILEENUM FUNCTION");
  console.log("" + color + shape);
  let colorNum = colors.indexOf(color);
  let shapeNum = shapes.indexOf(shape);
  return parseInt("" + colorNum + shapeNum);

function showSelection(c1, c2, color) {
  line = new PIXI.Graphics();
  line
    .lineStyle(5, color, 1)
    .moveTo(c1, c2)
    .lineTo(c1, c2 + 63)
    .moveTo(c1, c2)
    .lineTo(c1 + 63, c2)
    .moveTo(c1, c2 + 63)
    .lineTo(c1 + 63, c2 + 63)
    .moveTo(c1 + 63, c2 + 63)
    .lineTo(c1 + 63, c2);
  app.stage.addChild(line);
}



}*/