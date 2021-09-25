const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create structure for User documents
const userSchema = new Schema({
  userName:  String, // String is shorthand for {type: String}
  
  email: String,
  
  password:  { 
    type: String,
    required: true
  },
  
  userType: String,

  createdAt: { 
    type: Date, 
    default: Date.now 
  }   
});

//will create a collection call called User that will adhere to userSchema structure
userSchema.pre("save",function(next){
  //bcrypt uses double hashing.  Random text is generated  then concatonated the password

  bcrypt.genSalt(12)//complexity of salt is dependent on the size of the int passed
  .then((salt)=>{
      bcrypt.hash(this.password,salt)//first parameter is what you want hashed, second is the salt that was written 
      .then((encryptedPassword)=>{
          this.password=encryptedPassword;
          next();
      })
      .catch(err=>console.log(`Error occured when hashing; Error:${err}`));  
    })
  .catch(err=>console.log(`Error occured when salting; Error: ${err}`));  
}); 

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;