const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");

// Routes
const userRoutes = require("./routes/user-routes.js");
const courseRoutes = require("./routes/course-routes.js");
const gradeRoutes = require("./routes/grade-routes.js");
const paymentRoutes = require("./routes/payment-routes.js");
const progressRoutes = require("./routes/progress-routes.js");
const nbannounceRoutes = require("./routes/nbannounc-routes.js");
const notesRoutes = require("./routes/notes-routes.js");
const geminiRoute = require("./routes/geminiRoute.js");
const commentRoute = require("./routes/comment-routes.js");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-neon-one.vercel.app",
      "https://lms-abd.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

/* ✅ Middleware */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ Database */
connectDB();

/* ✅ Health Check */
app.get("/", (req, res) => {
  res.send("LMS backend running 🚀");
});

/* ✅ API Routes */
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/nbannounce", nbannounceRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/gemini", geminiRoute);
app.use("/api/comments", commentRoute);

/* ✅ Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
