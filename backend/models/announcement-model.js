const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	announcement: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	selectedCourse: {
		type: String,
		required: true,
		trim: true
	}
});

module.exports = mongoose.model("Announcement", announcementSchema);