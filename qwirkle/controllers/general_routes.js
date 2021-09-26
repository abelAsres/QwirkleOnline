const express = require('express');
const router = express.Router(); 
const userModel = require('../Models/User');

//Home Route
router.get('/', (req,res)=>{
    res.render('general/home',{
      title: 'Home'
    })
});

//registration route
router.get('/registration',(req,res)=>{
    res.render('general/registration',{
        title:"Registration"
    });
});

//registration route
router.post('/registration',(req,res)=>{
    const{userName,email,password,checkPassword}=req.body;


    //TODO: create validation for userName, email and passwords

});

module.exports=router;