const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
	courseName: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
	},
	creditHours: {
		type: Number, 
		default: 1
	},
	lectures: [{
		lectureTitle: { type: String, required: true },
		lectureUrl: { type: String, required: true }
	}],
	instructor: {
		name: String,
		degree: String,
		university: String,
		profilePicture: String
	},
	quizzes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Quiz'
	}],
	assignments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment"
	}],
	announcements: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Announcement"
	}]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);