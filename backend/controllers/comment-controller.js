const Comment = require("../models/comment-model.js");
const mongoose = require("mongoose");
const fs = require("fs");
const { isValidObjectId } = require("mongoose");

const createComment = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput.trim()) {
      return res.status(400).json({ message: "Comment can't be empty" });
    }

    const comment = await Comment.create({
      userInput,
      user: req.user._id,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { repliedText } = req.body;

    if (!repliedText.trim()) {
      return res.status(400).json({ message: "Comment can't be empty" });
    }

    if (!isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      repliedText,
      user: req.user._id,
    });

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name profilePicture")
      .populate("replies.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.user.equals(req.user._id)) {
  return res.status(403).json({ message: "Unauthorized" });
}


    await comment.deleteOne();
    res.status(200).json({message: "Comment deleted!!"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  addReply,
  getAllComments,
  deleteComment,
};
