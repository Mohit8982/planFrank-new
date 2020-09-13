const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const InterestSchema = new mongoose.Schema({
	Interest_name: {
		type: String,
		trim: true,
		required: true,
    },
    Interest_count: Number,
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

module.exports = mongoose.model("Interest", InterestSchema);