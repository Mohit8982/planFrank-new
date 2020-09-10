const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const intrestSchema = new mongoose.Schema({
	intrest_name: {
		type: String,
		trim: true,
		required: true,
    },
    intrest_count: Number,
	timestamp:{
		type: Number,
        required: true,
    },
    createdBy :{
        type: ObjectId,
        ref : "User",
        required: false
    },
    createdOn:{
        type: String,
		required: true,
    }
});

module.exports = mongoose.model("Intrest", intrestSchema);