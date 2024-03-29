const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	planTime:{
		type : String,
		required : false
	},
	planDate:{
		type : String,
		required : false
	},
	planLocation:{
		type : String,
		required : false
	},
	postedFrom:{
		type : String,
		required : false
	},
	image_url:{
		type : String,
		required : false
	},
	postedBy: {
		type : ObjectId,
		ref : "User",
		required: true
	},
	planCategory:{
		type : ObjectId,
		required : false
	},
	planCategoryname:{
		type : String,
		required : false
	},
	commentCount : Number,
	likesCount : Number,
	PinnedCount : Number,
	Pinned : [{ type: ObjectId, ref: "User" }],
	InterestedPeople : [{type: ObjectId}],
	InterestedCount: Number,
	likes: [{ type: ObjectId, ref: "User" }],
	createdAt: {
		type: String,
		required: true
	},
	timeStamp:{
		type: Number,
		required: true
	},
	plantimeStamp:{
		type: Number,
		required: false
	}
});

module.exports = mongoose.model("Plan", postSchema);