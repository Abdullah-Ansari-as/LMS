const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userInput: { type: String, required: true },
    aiResponse: { type: String, required: true },
    model: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
