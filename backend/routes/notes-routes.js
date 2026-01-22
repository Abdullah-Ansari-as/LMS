const express = require("express");
const { protect } = require('../middlewares/auth-mid.js');
const { addNote, fetchAllNotesByStudentId, deleteNote } = require("../controllers/notes-controller.js");

const router = express.Router();

router.post("/addnotes", protect, addNote);
router.get("/fetchnotes", protect, fetchAllNotesByStudentId);
router.delete("/deletenote/:id", protect, deleteNote);

module.exports = router;