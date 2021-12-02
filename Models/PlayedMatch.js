const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let moment = require('moment');
moment().format();

//Create structure for Play History documents
const matchSchema = new Schema({
  gameID:  String, // String is shorthand for {type: String}
  users: [{}],
  
  createdAt: { 
    type: String, 
    default:moment().format('MMMM Do YYYY, h:mm:ss a')
  }   
});


const matchPlayedModel = mongoose.model('MatchesPlayed',matchSchema);

module.exports = matchPlayedModel;