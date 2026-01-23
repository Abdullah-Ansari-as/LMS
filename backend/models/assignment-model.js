const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
	assignmentFile: {
		type: String, // this will store the filename (e.g., "assignment1.pdf")
		required: true,
	},
	dueDate: {
		type: String,
		required: true,
	},
	totalMarks: {
		type: Number,
		required: true,
	},
	selectedCourse: {
		type: String,
		required: true,
		trim: true
	},
});

module.exports = mongoose.model("Assignment", assignmentSchema);