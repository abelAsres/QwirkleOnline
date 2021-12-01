const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let moment = require('moment');
moment().format();

//Create structure for Play History documents
const playHistorySchema = new Schema({
  userName:  String, // String is shorthand for {type: String}
  gameID: String,
  score:Number,
  
  createdAt: { 
    type: String, 
    default: moment().format("MMM Do YY")
  }   
});


const playHistoryModel = mongoose.model('PlayHistory',playHistorySchema);

module.exports = playHistoryModel;