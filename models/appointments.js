const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  appSchema  =  new Schema({
  doctor: String,
  patient: String,
  time:String,
  date:String,
  description: String,
  meeting_link: String

},{timestamps:true});

let  Appointment  =  mongoose.model("Appointment", appSchema);
module.exports  = Appointment;