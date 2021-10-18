/* 
----------------------------------
    Enviornment Setup
----------------------------------
 1. npm init    
 2. npm i express --save
    - push enter for everything
    - answer yes
 3. npm i mongoose --save
 4. npm i dotenv
 5. create config directory in root
    - in the config directory create keys.env file
    - keys.env will be used to store all envirnment varibles (connection strings, usernames, passwords, PORT, etc... )
 6. npm i express-handlebars
 7. npm i express-session --save
*/

//Express web server that listens to incoming HTTP requests.
const express = require('express');
const app = express();

const mongoose =require('mongoose'); 
const exphbs= require('express-handlebars');

const bodyParser=require('body-parser');

//Can help store user data between http requests
const session = require('express-session');

//express.js registers handlebars as its Template Engine (Handlebars)
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load the enviornment varible file
require('dotenv').config({path:"./config/keys.env"}); 


//parse application/x-www-form-urlencoded
//allows you to use req.body.(property name)
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//load static resources(assests)
app.use(express.static("public"));

//load each controller
const generalController=require("./controllers/general_routes");
const userController = require("./controllers/user_routes");

//
app.use(session({
  secret: process.env.SESSION_KEY || "testsession",
  resave: false,
  saveUninitialized: true,
  //  cookie: { secure: true }
  }))

app.use((req,res,next)=>{
  res.locals.user=req.session.userInfo;
  next();
});

/*
    This will allow specific forms and/or links that were submitted/pressed to send
    PUT and DELETE requests
*/
app.use((req,res,next)=>{
  if(req.query.method=="PUT"){
      req.method="PUT";
  }else if(req.query.method=="DELETE"){
      req.method="DELETE";
  }
  next();
});

//Map each controller to the app object
app.use('/', generalController);
app.use('/user',userController);


//Connect to Database
mongoose.connect(process.env.MONGO_DB_CONNECT)
.then(()=>{
    console.log('Connected to MongoDB')
})
.catch(err=> console.log(`Could not connect to MongoDB: ${err}`));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});