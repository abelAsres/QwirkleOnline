const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const isAuthenticated = require('../middleware/authenticateUser');
const isAuthorized = require('../middleware/authorizationUser');
const userModel = require('../Models/User');
const loadDashBoard = require('../middleware/authorizationUser');

//authentication is turned off for game development

router.get('/join/:id?'/*,isAuthenticated*/, (req, res) => {
    console.log(`Sending you to room: ${req.query.id}`);
    res.render('game/game',{
        title:'Game Page',
        style: 'game.css',
        gameID: req.query.id,
        user:req.session.userInfo
    });
});

router.get('/',/*isAuthenticated,*/(req,res)=>{
    //create invitation
    // let newDiv = document.createElement("div");
    // let newAnchor = document.createElement("a");
    
    // const newContent = document.createTextNode("This is a game invite");

    // newAnchor.appendChild(newContent);
    // newAnchor.href="http://localhost:3000/game";
    // newAnchor.title="Game Invite";

    // newDiv.appendChild(newAnchor);
    
    res.render('game/game',{
        title:'Game Page',
        style: 'game.css'
    });
});


module.exports=router;