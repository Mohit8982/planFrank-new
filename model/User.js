const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	mobile:{
		type: String,
		trim: true,
		required: true,
	},
	username: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
	},
	hashed_password: {
		type: String,
		required: true,
	},
	created: {
		type: String,
		required: true,
	},
	photo: {
		data: Buffer,
		contentType: String,
		required : false
	},
	about: {
		type: String,
		trim: true,
		required : false
	},
	verified:{
		type : Boolean,
		required : true
	},
	timeStamp : {
		type : Number,
		required : true
	},
	veri_code:{
		type : Number,
		required : true
	},
	following: [{ type: ObjectId, ref: "User" }],
	followers: [{ type: ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);