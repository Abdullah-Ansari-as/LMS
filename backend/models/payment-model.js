const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
	dueDate: {
		type: String,
		default: Date.now()
	},
	ammount: {
		type: String,
		required: true
	},
	description: {
		type: String,
		defalut: "Semester Fee/ Library Charges"
	},
	challanNo:{
		type: String,
		default: "123456789"
	}
});

module.exports = mongoose.model("Payment", paymentSchema); 