const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
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
    console.log('starting registration')
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

    const ck_userName= /^[A-Za-z0-9]{6,12}$/;
    const ck_password =  /^[A-Za-z0-9!@$%&*_]{8,20}$/;
    const ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
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

    //check username
    
    if (!ck_userName.test(userName)){
        
        console.log('checking userName');
        //document.getElementById('username-error').innerHTML=error_messages[0];
        errors.username.push(error_messages[0]);
        passValidation = false;
    }
    
    //check email
    if (!ck_email.test(email)){
        
        console.log('checking email');
        //document.getElementById('email-error').innerHTML=error_messages[1];
        errors.email.push(error_messages[1]);
        passValidation = false;
    }

    //check password
    if (!ck_password.test(password)){
        
        console.log('cheking email');
        //document.getElementById('password-error').innerHTML=error_messages[2];
        errors.password.push(error_messages[2]);
        passValidation = false;
    }

    //verify password
    if (checkPassword.localeCompare(password) != 0) {
        console.log('verifing password');
        //document.getElementById('check-password-error').innerHTML=error_messages[3];
        errors.verifyPassword.push(error_messages[3]);
        passValidation = false;
    }

    //check for any errors
    if(!passValidation) {
        
        console.log('did not pass validation');
        res.render('general/registration', {
            title: 'Registration',
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
                errors.email.push(error_messages[4])
                res.render('general/registration',{
                    title:"Registration",
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
                    username:userName,
                    email:email,
                    password:password
                }

                const user = new userModel(newUser);
                user.save()
                .then(()=>{
                    res.redirect('login');
                })

            }
        }))
        .catch(err=>console.log(`Error occured when inserting in the database; Error: ${err}`));
    } 
});

//registration route
router.get('/login',(req,res)=>{
    res.render('general/login',{
        title:"Login"
    });
});

router.get('/dashboard',(req,res)=>{
    res.render('general/dashboard',{
        title:"dashboard"
    });
});

router.post('/login',(req,res)=>{
    const{email,password}=req.body;
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

    let passValidation = true;
    
    //Store submited values to be autofilled if any errors
    if(email) {
        entered_fields.email.push(email);
    }
    //Store submited values as password
    //if(password) {
     //   entered_fields.password.push(password);
   // }
    
    userModel.findOne({email:email},{_id:0,__v:0})
    .then((doc=>{
        if(doc!=null){
            const user = new userModel(doc);
            console.log(user);
            console.log(doc.password, " ", entered_fields.password);
            bcrypt.compare(password, doc.password).then((result)=>{
                if(result){
                    res.redirect('dashboard');
                }
                else{
                    errors.password.push(error_messages[1]);
                    res.render('general/login', {
                        title: 'Login',
                        errors: errors,
                        populate_fields: entered_fields
                    });            
                }
            })
        } else {
            errors.email.push(error_messages[0]);
            res.render('general/login', {
                title: 'Login',
                errors: errors,
                populate_fields: entered_fields
            });    
        }
    }))
    .catch(err=>console.log(`Error occured when retrieving user info; Error: ${err}`));
});

module.exports=router;