const mongoose = require("mongoose");

const nbAnnouncSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	message: { 
		type: String, 
		required: true
	},
	date: {
		type: String,
		required: true
	}
}, {timestamps: true});

module.exports = mongoose.model("Nbannounc", nbAnnouncSchema);