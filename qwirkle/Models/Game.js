const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create structure for Games
const gameSchema = new Schema({
  gameID:  Number, 

  p1ID: String,
  p1Score:  Number, 

  p2ID: String,
  p2Score:  Number, 

  p3ID: String,
  p3Score:  Number, 

  p4ID: String,
  p4Score:  Number, 

  email: String,

  createdAt: { 
    type: Date, 
    default: Date.now 
  }   
});

//will create a collection call called User that will adhere to userSchema structure
gameSchema.pre("save",function(next){
  //bcrypt uses double hashing.  Random text is generated  then concatonated the password
}); 

const gameModel = mongoose.model('Game',gameSchema);

module.exports = gameModel;