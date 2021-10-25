/*
const express = require('express');
const pixi = require('pixi.js');
*/
const app = new PIXI.Application({width: 600, height: 600});
//const grid = new PixiJSGrid(width).drawGrid();
const socket = io();

var playerList = [];
let gameID;// = document.getElementById('copy-invite-button').innerText;
var playerID = name;
// Temporary variable, will be replaced with username when it becomes available.
var playerNum;

function CopyToClipboard () {
    /* Get the text field */
  var copyText = document.getElementById("copy-invite-button");

  /* Select the text field */
  //copyText.select();
  //copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.href);
  
  /* Alert the copied text */
  alert("Copied the text: " + copyText.href);
    
    /*
    const link = document.querySelector('#copy-invite-button');
    var range = document.createRange();
    range.selectNode(link);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");//method is deprecated need alternative!!!!
    alert("text copied");
    */
}

function startGame(){
    console.log('Start game has been pressed');
}


$(document).ready(function(){

    // Check if user came through the create button or joined. 
    if (gameID == undefined){
        socket.emit('create-room', "");
        UpdatePlayerList(1);
        playerNum = 1;
    }
    // When the else fires. Client will emit a request that adds them to the room. 
    // The server will respond with an emit to all current players updating player list 
    else {
        socket.emit('join-room', {gameID: gameID, username: 'username'});
    }
    $("#game-app").append(app.view);
    $("#game-app").append("<h1>Hello World. Why is the game not here?</h1>");
});

socket.on('room-created', id => {
    gameID = id;

    //Update fields with generated game room info
    //document.getElementById('copy-invite-button').innerText = gameID;
    document.getElementById('copy-invite-button').href = '/game/join?id=' + gameID;
    
    $("#copy-invite-button").append();

    console.log(`Player ${playerNum} has joined game #${gameID}`);
});

// Should update page info to reflect current status.
socket.on('room-joined', (data) => {
    const {id, count} = data
    // Update player list. 
    playerNum = count;

    console.log(`Player ${playerNum} has joined game #${gameID}`);
});

//
socket.on('update-player-list', count =>{
    UpdatePlayerList(count);
})

function ready(){
    console.log('Ready has been pressed');
    socket.emit('ready', {gameID: gameID, playerID: playerNum});
}

socket.on('update-player-status', playerNum =>{
    console.log(`Player ${playerNum} is ready`);
    $("#player-" + playerNum + "S").replaceWith("<td id=&quot;player-"+ playerNum + "S&quot;>Ready</td>");
});

// Currently incomplete
function UpdatePlayerList (count) {
    for (let i = 1; i <= count; i++){
        $("#player-" + i).replaceWith("<td id=player-" + i + ">Player " + i + "</td>");
        $("#player-" + i + "S").replaceWith("<td id=player-"+ i + "S>Not Ready</td>");
    }
}
