const Chat = require("../models/ai-model.js");
const User = require("../models/user-model.js");
const axios = require("axios");

const generateText = async (req, res) => {
  // console.log(req.user);
  const { email } = req.user;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    const { input } = req.body;

    if (!input) {
      return res
        .status(400)
        .json({ success: false, error: "content feild is required!" });
    }

    let data = JSON.stringify({
      system_instruction: {
        parts: [
          {
            text: input,
          },
        ],
      },
      contents: [
        {
          parts: [
            {
              text: "Hello there",
            },
          ],
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      data,
    };

    const AiResponse = await axios.request(config);

    const aiText =
      AiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!AiResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to Generate Ai Response",
      });
    }

    let response = await Chat.create({
      userInput: input,
      aiResponse: aiText,
      user: user?._id,
    });

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log("gemini error...", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

const chatHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    const chats = await Chat.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log("Error is chat History... ", error.message);
    res.status(500).json({ error: "Failed to fetch Chat history" });
  }
};

module.exports = {
  generateText,
  chatHistory,
};
