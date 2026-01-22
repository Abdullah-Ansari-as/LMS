const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		match: [/.+\@.+\..+/, "Please enter the valid email address"],
	},
	password: {
		type: String,
		required: true,
		minLength: 3
	},
	role: {
		type: String,
		default: "student"
	},
	profilePicture: {
		type: String,
		default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g_2Qj3LsNR-iqUAFm6ut2EQVcaou4u2YXw&s"
	},
	loginHistory: {
		type: [Date], 
		default: Date.now,
	}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);