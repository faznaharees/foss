const mongoose = require('mongoose');

//User Scehema
/*
const UserSchema = mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  email:{
    type: String,
    required:true
  },
  username:{
    type: String,
    required:true
  },
  password:{
    type: String,
    required:true
  },

});
*/
const UserSchema = mongoose.Schema({
  username:{
    type: String,
    required:true
  },
  password:{
    type: String,
    required:true
  },

});

UserSchema.username = 'admin';
UserSchema.password = 'password';

const User = module.exports = mongoose.model('User',UserSchema);
