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


const app = express(); 

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

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
})