const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const isAuthenticated = require('../middleware/authenticateUser');
const isAuthorized = require('../middleware/authorizationUser');
const userModel = require('../Models/User');
const loadDashBoard = require('../middleware/authorizationUser');

router.get('/join/:id?', (req, res) => {
    console.log(`Sending you to room: ${req.query.id}`);
    res.render('game/game',{
        title:'Game Page',
        gameID: req.query.id
    });
});

router.get('/',(req,res)=>{
    //create invitation
    // let newDiv = document.createElement("div");
    // let newAnchor = document.createElement("a");
    
    // const newContent = document.createTextNode("This is a game invite");

    // newAnchor.appendChild(newContent);
    // newAnchor.href="http://localhost:3000/game";
    // newAnchor.title="Game Invite";

    // newDiv.appendChild(newAnchor);
    
    res.render('game/game',{
        title:'Game Page'
    });
});


module.exports=router;