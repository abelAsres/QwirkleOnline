const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const userModel = require('../Models/User');
const validation = require('../public/js/validation');
const gameModel = require('../Models/Game');
const modaljs = require('../public/js/modal')

//Home Route
router.get('/', (req,res)=>{
    res.render('general/home',{
      title: 'Home',
      style: 'home.css'
    })
});

//registration route
router.get('/registration',(req,res)=>{
    res.render('general/registration',{
        title:"Registration",
        style: 'registration.css'
    });
});

//registration route
router.post('/registration',(req,res)=>{
    //console.log('starting registration')
    const{userName,email,password,checkPassword}=req.body;


    //TODO: create validation for userName, email and passwords

    const errors = {
        username:[],
        email:[],
        password:[],
        verifyPassword:[]
    }
    
    const entered_fields = {
        username:[],
        email:[] 
    }
    
    const error_messages = ['Invalid username: Please only use alphanumeric characters',
                            'Invalid email',
                            'Invalid password: You can only use alphanumeric characters and (!@$%&*_)',
                            'Password does not match',
                            'This email is already in use'
    ];
    
    let passValidation = true;
    
    //Store submited values to be autofilled if any errors
    if(userName) {
        console.log('storing username');
        entered_fields.username.push(userName);
    }

    if(email) {
        console.log('storing email');
        entered_fields.email.push(email);
    }

    if(!validation.validateUserName(userName)){
        passValidation = false;
        errors.username.push(error_messages[0]);
    }

    if(!validation.validateEmail(email)){
        passValidation = false;
        errors.email.push(error_messages[1]);
    }

    if(!validation.validatePassword(password)){
        passValidation = false;
        errors.password.push(error_messages[2]);
    }

    if(!validation.verifyPassword(checkPassword,password)){
        passValidation = false;
        errors.verifyPassword.push(error_messages[3]);
    }

    //check for any errors
    if(!passValidation) {
        
        console.log('did not pass validation');
        res.render('general/registration', {
            title: 'Registration',
            style:'registration.css',
            errors: errors,
            populate_fields: entered_fields
        });
    } 
    
    if (passValidation) {
        //validation has passed store user to cluster
        console.log('passed validation');
        userModel.findOne({email:email},{_id:0,__v:0})
        .then((doc=>{
            if(doc!=null){
                errors.email.push(error_messages[4]);
                res.render('general/registration',{
                    title:"Registration",
                    style:'registration.css',
                    errors:errors,
                    populate_fields: entered_fields,
                    data:doc
                });
            } else {
                /*
                Rules for inserting into a MongoDB database USING mongoose ODM is to do the following:
                1. Create instance of the model,you must pass data you want inserted 
                in the form of an object(object literal)
                
                2. From the instance, call the save method
                */
               
                console.log('creating new user');

                const newUser={
                    userName:userName,
                    email:email,
                    password:password
                }
                const user = new userModel(newUser);
                console.log(user);
                user.save()
                .then(()=>{
                    res.redirect('/login?showModal=true');
                })
                
            }
        }))
        .catch(err=>console.log(`Error occured when inserting in the database; Error: ${err}`));
    } 
});

//login route
router.get('/login',(req,res)=>{
    console.log('get login: '+req.query.gameId);
    let showModal = req.query.showModal;
    let gameId = req.query.gameId;

    res.render('general/login',{
        title:"Login",
        style: 'login.css',
        showModal:showModal,
        gameId: gameId
    });
});

//logout route
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect("/");
});

router.post('/login',(req,res)=>{
    console.log(req.body);
    const{email,password,gameId}=req.body;
    const entered_fields = {
        email:[],
        password:[] 
    }

    const errors = {
        email:[],
        password:[]
    }
    const error_messages = ['No account with that email',
                            'Incorrect password',
    ];
    
    //Store submited values to be autofilled if any errors
    if(email) {
        entered_fields.email.push(email);
    }
    
    userModel.findOne({email:email},{_id:0,__v:0})
    .then((doc=>{
        if(doc!=null){
            const user = new userModel(doc);
            //console.log(user);
            //console.log(doc.password, " ", entered_fields.password);
            bcrypt.compare(password, doc.password).then((result)=>{
                if(result){
                    req.session.userInfo = doc;
                    console.log('gameID'+req.query.gameId);
                    if (gameId){
                        res.redirect('game/join?id='+gameId);
                    }
                    res.redirect('user/dashboard');
                }
                else{
                    errors.password.push(error_messages[1]);
                    res.statusCode=401;
                    res.render('general/login', {
                        title: 'Login',
                        style:'dashboard.css',
                        errors: errors,
                        populate_fields: entered_fields
                    });            
                }
            })
        } else {
            errors.email.push(error_messages[0]);
            res.statusCode=401;
            res.render('general/login', {
                title: 'Login',
                style:'login.css',
                errors: errors,
                populate_fields: entered_fields
            });    
        }
    }))
    .catch(err=>console.log(`Error occured when retrieving user info; Error: ${err}`));
});

module.exports=router;