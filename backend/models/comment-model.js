const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    repliedText: { type: String, required: true, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    userInput: { type: String, required: true, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
