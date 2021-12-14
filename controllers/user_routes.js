const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const matchesPlayed = require('../Models/PlayedMatch');
const isAuthenticated = require('../middleware/authenticateUser');
const isAuthorized = require('../middleware/authorizationUser');
const userModel = require('../Models/User');
const playedGames = require('../Models/PlayHistory');
const matchDetails = require('../Models/PlayedMatch');

//dashboard route with verfication middleware
router.get('/dashboard',isAuthenticated,isAuthorized);

//update user profile
router.put('/update', (req,res)=>{
    const{userName,password}= req.body;
    //TODO: create validation for userName, email and passwords
    const errors = {
        username:[],
        password:[]
    }

    const error_messages = ['Invalid username: Please only use alphanumeric characters',
                            'Current password is incorrect',
                            'Invalid password: You can only use alphanumeric characters and (!@$%&*_)',
                            'Password does not match',
                            'This email is already in use'
    ];

    const ck_userName= /^[A-Za-z0-9]{6,12}$/;
    let passValidation = true;

    //check username
    if (!ck_userName.test(userName)){
        errors.username.push(error_messages[0]);
        passValidation = false;
    }

    

    userModel.findOne({email:req.session.userInfo.email},{_id:0,__v:0})
    .then((doc=>{
        if(doc!=null){
            bcrypt.compare(password, doc.password).then((result)=>{
                if(!result){
                    errors.password.push(error_messages[1]);
                    passValidation = false;           
                }
            })
        }
    }));


    //check for any errors
    if(!passValidation) {
        
        res.render('/dashboard', {
            title: 'User Page',
            style:'dashboard.css',
            errors: errors
        });
    } 

    if (passValidation) {
        let user={
            userName:userName
        }

        playedGames.updateMany({userName:req.session.userInfo.userName},{'$set':{"userName":user.userName}})
        .then(()=>{
            matchDetails.updateMany({'users.playerID':req.session.userInfo.userName}, {'$set':{
                'users.$.playerID': user.userName
            }})
            .then(()=>{
                req.session.userInfo.userName=user.userName;
                userModel.updateOne({email:req.session.userInfo.email},user)
                .then(()=>{
                    res.redirect("/user/dashboard");
                })
                .catch(err=>console.log(`Error: ${err}`));
            })
            .catch(err=>console.log(`Error: ${err}`));
            })
        .catch(err=>console.log(`Error: ${err}`));
    }
});

router.get('/match/:id', (req,res)=>{
console.log(`in match router looking for ${req.params.id}`)
    matchesPlayed.findOne({gameID:req.params.id}).lean()
    .then((doc)=>{
        console.log(doc);
        res.render('user/match',{
        tite: 'Match Page',
        style:'match.css',
        matchData: doc
    })
  })
})

module.exports=router;