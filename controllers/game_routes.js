const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const isAuthenticated = require('../middleware/authenticateUser');

//authentication is turned off for game development

router.get('/join/:id?',isAuthenticated, (req, res) => {
    console.log(`Sending you to room: ${req.query.id}`);
    
    res.render('game/game',{
        title:'Game Page',
        style: 'game.css',
        gameID: req.query.id,
        user: req.session.userInfo
    });
    
});

router.get('/play',isAuthenticated, (req, res) => {
    res.render('game/play',{
        title:'Game Page',
        style: 'game.css',
        gameID: req.query.id,
        user: req.session.userInfo
    });
});

router.get('/',isAuthenticated,(req,res)=>{
    res.render('game/game',{
        title:'Game Page',
        style: 'game.css',
        user: req.session.userInfo
    });
});


module.exports=router;