const mongoose = require("mongoose");

const submitQuizSchema = new mongoose.Schema({
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	quizId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Quiz",
		required: true
	},
	submittedAt: {
		type: Date,
		default: Date.now
	},
	course: String,
	quizQuestions: [{
		question: { type: String, required: true },
		options: { type: [String], required: true, trim: true },
		selectedAnswer: { type: String, required: true }
	}],
	quizNo: {type: String, required: true},
	submit: Boolean,
	result: {
		type: Number,
		default: 0.00
	}
});

module.exports = mongoose.model("SubmitedQuiz", submitQuizSchema);