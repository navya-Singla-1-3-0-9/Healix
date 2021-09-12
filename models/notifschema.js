const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  notifSchema  =  new Schema({
  from: String,
  for: String,
  time:String,
  date:String,
  description: String,
  link: String,
  status: String

},{timestamps:true});

let  Notif  =  mongoose.model("Notif", notifSchema);
module.exports  = Notif;