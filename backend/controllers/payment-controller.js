const Payment = require("../models/payment-model.js")

const payment = async (req, res) => {
	try {
		const {ammount, challanNo, description, dueDate} = req.body; 

		const newPayment = new Payment({
			ammount, 
			description,
			dueDate,
			challanNo
		});

		if(!newPayment) {
			return res.status(500).json({message: "Failed to upload payment!"});
		}

		await newPayment.save();

		return res.status(201).json({
			success: true,
			payment: newPayment,
			message: "Upload payment successfully!"
		})

	} catch (error) {
		console.error(error);
		return res.status(500).send("Failed to upload payment!");
	}
}

const getPayment = async (req, res) => {
	try {
		const getPayment = await Payment.find();

		if(!getPayment) {
			return res.status(404).json({message: "Failed to get payments"});
		};

		return res.status(201).json({
			success: true,
			getPayment,
			message: "Get payment successfully!"
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get Payment!");
	}
}

module.exports = {payment, getPayment};