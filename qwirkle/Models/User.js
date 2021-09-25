import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  userName:  String, // String is shorthand for {type: String}
  email: String,
  body:   String,
  createdAt: { type: Date, default: Date.now }
});