const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  callSchema  =  new Schema({
  group: String,
  start: [String],
});

let  Call  =  mongoose.model("Call", callSchema);
module.exports  = Call;