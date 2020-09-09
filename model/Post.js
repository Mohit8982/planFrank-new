const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	photo: {
		data: Buffer,
		contenType: String,
	},
	postedBy: {
		type: ObjectId,
		ref: "User",
	},
	commentCount: Number,
	likesCount: Number,
	likes: [{ type: ObjectId, ref: "User" }],
	created: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Post", postSchema);
