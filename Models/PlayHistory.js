const mongoose = require('mongoose');
const userModel = require('./User');
const Schema = mongoose.Schema;
let moment = require('moment');
moment().format();

//Create structure for Play History documents
const playHistorySchema = new Schema({
  userName:  String, // String is shorthand for {type: String}
  gameID: String,
  score:Number,
  
  playedOn:{
    type: String,
    default:moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }   
});


const playHistoryModel = mongoose.model('PlayHistory',playHistorySchema);

module.exports = playHistoryModel;