const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
	studentId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	note: { 
		type: String, 
		required: true
	},
	date: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Note", notesSchema);