const mongoose = require('mongoose');
const  Schema  =  mongoose.Schema;
const  userprofile  =  new Schema({

    name:String,
    Surname:String,
    number: String,
    address: String,
    email:String,
    e:String,
    age:String,
    weight:String,
    diseases:String,
    doctors:String,
   

});
let  User  =  mongoose.model("Users", userprofile);
module.exports  = User;