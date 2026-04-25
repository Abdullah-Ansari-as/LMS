const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MongoDB connection failed! Missing MONGO_URI in environment.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    // Don't crash the whole server; keep it up so non-DB routes can work,
    // and retry in the background.
    console.error("MongoDB connection failed!", error);
    setTimeout(() => {
      connectDB().catch(() => {
        /* handled above */
      });
    }, 5000);
  }
};

module.exports = connectDB;