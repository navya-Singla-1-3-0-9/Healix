const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  doctorSchema  =  new Schema({
   username: String,
   first_name: String,
   last_name: String,
   description: String,
   specialty: String,
   m_uni: String,
   b_uni: String,
   m_loc:String,
   b_loc: String,
   price: String,
   img:String,
   reviews: [
	{
		type: Schema.Types.ObjectId,
		ref:'Review'
	}
	]

});
let  Doctor  =  mongoose.model("Doctor", doctorSchema);
module.exports  = Doctor;