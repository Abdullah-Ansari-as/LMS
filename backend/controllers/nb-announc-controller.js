const Nbannounce = require("../models/nb-announc-model.js");

const NbAnnounce = async (req, res) => {
	try {
		const {title, message, date} = req.body;
		const nbAnnounce = new Nbannounce({
			title, 
			message,
			date
		});
		if(!nbAnnounce) {
			return res.status(500).send("Failed to upload Notice Board annoucements!");
		};

		await nbAnnounce.save();

		return res.status(201).json({
			success: true,
			message: "Notice Board Annoucement Uploaded Successfully",
			nbAnnounce
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to upload Notice Board annoucements!");
	}
}

const getAllNbAnnouncements = async (_, res) => {
	try {
		const allAnnouncements = await Nbannounce.find();
		if(!allAnnouncements) {
			res.status(404).json({message: "Announcements not found!"})
		}

		return res.status(200).json({
			success: true,
			allAnnouncements,
			message: "Get All Notice Board Annoucements Successfully!"
		});
		
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get all Notice Board annoucements!");
	}
}

module.exports = {NbAnnounce, getAllNbAnnouncements}