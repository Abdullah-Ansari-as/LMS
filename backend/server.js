const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes.js");
const courseRoutes = require("./routes/course-routes.js");
const gradeRoutes = require("./routes/grade-routes.js");
const paymentRoutes = require("./routes/payment-routes.js");
const progressRoutes = require("./routes/progress-routes.js");
const nbannounceRoutes = require("./routes/nbannounc-routes.js");
const notesRoutes = require("./routes/notes-routes.js");
const geminiRoute = require("./routes/geminiRoute.js");
const commentRoute = require("./routes/comment-routes.js") 


const app = express(); 
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5175",
      "https://lms-abd.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:5175",
      "https://lms-abd.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.static("public"));
app.use(express.json({ limit: "10mb" })); // must allow big body size
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
	res.send("Welcome to Lms backend!");
});


// API routes here
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/nbannounce", nbannounceRoutes);
app.use("/api/notes", notesRoutes);

// Gemini routes
app.use("/api/gemini", geminiRoute);

// commnet routes

app.use("/api/comments", commentRoute)

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
})