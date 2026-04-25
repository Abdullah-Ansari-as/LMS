const express = require("express");
const { protect } = require('../middlewares/auth-mid.js');
const { createComment, addReply, getAllComments, deleteComment, deleteReply, getCommentsByLecture } = require("../controllers/comment-controller.js");

const router = express.Router();

router.post("/createComment/:lectureId", protect, createComment);
router.post("/addReply/:commentId", protect, addReply);
router.get("/getComments", getAllComments);
router.delete("/deleteComment/:commentId",protect ,deleteComment);
router.delete("/:commentId/deleteReply/:replyId",protect ,deleteReply);
router.get("/:lectureId/getCommentsByLecture",protect ,getCommentsByLecture);

module.exports = router;