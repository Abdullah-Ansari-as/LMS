const express = require("express");
const { protect } = require('../middlewares/auth-mid.js');
const { createComment, addReply, getAllComments, deleteComment } = require("../controllers/comment-controller.js");

const router = express.Router();

router.post("/createComment", protect, createComment);
router.post("/addReply/:commentId", protect, addReply);
router.get("/getComments", getAllComments);
router.delete("/deleteComment/:commentId",protect ,deleteComment);

module.exports = router;