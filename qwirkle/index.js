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

//Can help store user data between http requests
const session = require('express-session');

//express.js registers handlebars as its Template Engine (Handlebars)
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//load the enviornment varible file
require('dotenv').config({path:"./config/keys.env"}); 

//
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  //  cookie: { secure: true }
  }))


//Connect to Database
mongoose.connect(process.env.MONGO_DB_CONNECT)
.then(()=>{
    console.log('Connected to MongoDB')
})
.catch(err=> console.log(`Could not connect to MongoDB: ${err}`));

//Test request
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});