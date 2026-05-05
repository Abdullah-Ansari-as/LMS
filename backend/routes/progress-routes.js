const express = require("express"); 
const { protect } = require('../middlewares/auth-mid.js');
const { isAdmin } = require("../middlewares/admin-mid.js");
const {
	ProgressController,
	markLectureComplete,
	getStudentProgress,
} = require("../controllers/progress-controller.js");

const router = express.Router();

router.post("/lecture/:courseId/:lectureId", protect, markLectureComplete);
router.get("/student/:studentId", protect, isAdmin, getStudentProgress);
router.get("/:course", protect, ProgressController);

module.exports = router