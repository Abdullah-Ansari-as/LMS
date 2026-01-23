const { default: mongoose } = require("mongoose");
const Note = require("../models/notes-model.js");

const addNote = async (req, res) => {
	try {
		const { title, note, date, studentId } = req.body;
		if (!title || !note || !date || !studentId) {
			return res.status(401).json({ message: "Required title, note and date as well!" });
		}

		const newNote = new Note({
			title,
			note,
			date,
			studentId
		});

		await newNote.save();

		return res.status(201).json({
			success: true,
			message: "Note Added Successfully",
			newNote
		});

	} catch (error) {
		console.error(error);
		return res.status(500).send("Failed to add note!");
	}
}

const fetchAllNotesByStudentId = async (req, res) => {
	const studentId = req.user?._id
	try {
		const notes = await Note.find({studentId});
		if (!notes) {
			return res.status(404).json({ message: "Notes not Found!" });
		}
		return res.status(200).json({
			success: true,
			message: "Notes fetch successfully",
			notes
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to fetch all notes!");
	}
}

const deleteNote = async (req, res) => {
	const { id } = req.params;
	const studentId = req.user?._id
	try {
		const deletedNoted = await Note.findByIdAndDelete(id);

		const remainingNotes = await Note.find({studentId});

		res.status(200).json({
			message: "Note deleted successfully",
			success: true,
			remainingNotes,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to delete note!");
	}
}

module.exports = {
	addNote,
	fetchAllNotesByStudentId,
	deleteNote
}