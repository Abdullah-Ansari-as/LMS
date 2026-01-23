const express = require("express");
const {generateText, chatHistory} = require("../controllers/gemeni-controller.js");
const { protect } = require("../middlewares/auth-mid.js");

const router = express.Router();

router.post("/generate", protect, generateText);
router.get("/chat/history", protect, chatHistory)

module.exports = router;