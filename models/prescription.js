const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  presSchema  =  new Schema({
  from: String,
  for: String,
  time:String,
  date:String,
  link: String,
  symptoms: String,
  tests: String,
  advice: String,
  medicines: String,
  names:[String]

},{timestamps:true});

let  Prescription  =  mongoose.model("Prescription", presSchema);
module.exports  = Prescription;