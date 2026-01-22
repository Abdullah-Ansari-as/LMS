const mongoose = require("mongoose");

const submitAssigSchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	assignmentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment",
		required: true
	},
	course: String,
	file: {
		type: String,	
		required: true
	},
	submittedAt: {
		type: Date,
		default: Date.now
	},
	submit: Boolean,
	result: {
		type: Number,
		default: 0.00
	}
});

module.exports = mongoose.model("SubmitedAssignment", submitAssigSchema);
