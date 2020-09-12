const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pinnedSchema = new mongoose.Schema({
	post_id : {
		type: ObjectId,
		ref : "Plan",
		required: true,
    },
    user_id:{
        type: ObjectId,
        ref : "User",
		required: true,
    },
    planStamp:{
        type: Number,
        required: true,
    },
    timestamp:{
		type: Number,
        required: true,
    },
    createdOn:{
        type: String,
		required: true,
    }
});

module.exports = mongoose.model("pinned_post", pinnedSchema);