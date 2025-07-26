const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
	selectedStudent: {
		type: String,
		required: true
	},
	selectedStudentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	selectedCourse: {
		type: String,
		required: true,
		trim: true
	},
	title: {
		type: String,
		required: true
	},
	assignmentGrade: {
		type: Number,
		required: true,
		default: 0
	},
	quizGrade: {
		type: Number,
		required: true,
		default: 0
	},
	assignmentSubmited: {
		type: Boolean,
		default: false
	},
	quizSubmited: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model("Grade", gradeSchema); 