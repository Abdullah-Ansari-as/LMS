const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
	dueDate: {
		type: String,
		required: true
	},
	totalMarks: {
		type: Number,
		required: true
	},
	quizQuestions: [{
		question: { type: String, required: true },
		options: { type: [String], required: true, trim: true },
		correctOption: { type: String, required: true }
	}],
	selectedCourse: {
		type: String,
		required: true,
		trim: true
	},
});

module.exports = mongoose.model("Quiz", quizSchema);