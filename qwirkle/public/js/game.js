const socket = io();

var playerList = [];
var gameID = document.getElementById('copy-invite-button').innerText;

CopyToClipboard = function (containerid) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges(range);
    window.getSelection().addRange(range);
    document.execCommand("copy");//method is deprecated need alternative!!!!
    alert("text copied");
}

$(document).ready(function(){
    console.log(gameID);
    // Check if user came through the create button or joined. 
    if (gameID == ""){
        socket.emit('create-room', "");
        UpdatePlayerList();
    } else {
        socket.emit('join-room', gameID);
    }
});

socket.on('room-created', id => {
    console.log(`Created room ${id}`);
    gameID = id;
    document.getElementById('copy-invite-button').innerText = gameID;
});

// Should update page info to reflect current status.
socket.on('room-joined', id => {
    // Update player list. 
    UpdatePlayerList();

    console.log(`Joined room ${id}`);
});

// Currently incomplete
UpdatePlayerList = function (count) {
    $("#player-list").append('<li>Player X - Not Ready</li>');
}

