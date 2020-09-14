const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema({
	commentDetail: {
		type: String,
		required: true,
	},
	post_id:{
		type: ObjectId,
		required: true
	},
	commentee_id: {
		type: ObjectId,
		ref: "User",
		required: true,
	},
	commentTime:{
		type : String,
		required : true
	},
	commentDate:{
		type : String,
		required : true
	},
	timeStamp:{
		type : Number,
		required : true
	},
	commentLikes :{
		type : Number,
		required : false
	}
});

module.exports = mongoose.model("post_comment", commentSchema);