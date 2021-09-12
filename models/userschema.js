const  mongoose  = require("mongoose");
const passportLocalMongoose= require('passport-local-mongoose');
const  Schema  =  mongoose.Schema;
const  userSchema  =  new Schema({
   username: String,
   email:String,
   role: String,
   last_checked: String,

});
userSchema.plugin(passportLocalMongoose);
let  User  =  mongoose.model("User", userSchema);
module.exports  = User;