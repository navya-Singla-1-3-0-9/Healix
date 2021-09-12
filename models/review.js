const mongoose = require('mongoose');

const schema= mongoose.Schema;
const reviewschema= new schema({
	body: String,
	rating: Number,
	author: {
		type: schema.Types.ObjectId,
		ref: 'User'
	}
});
module.exports= mongoose.model("Review", reviewschema);