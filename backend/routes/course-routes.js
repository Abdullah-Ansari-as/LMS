const express = require("express");
const { isAdmin } = require("../middlewares/admin-mid.js");
const { protect } = require('../middlewares/auth-mid.js');
const { newCourse, uploadLecture, getAllCourses, uploadAssignmentFormAdmin, submitAssignment, uploadQuizFromAdmin, fetchAssignmentsById, fetchQuizesById, submitQuiz, uploadAnnouncement, getAnnouncementsByCourseId, getTotalAnnouncements } = require("../controllers/course-controller.js");
const { upload } = require("../utils/uploadAssignment.js")
const path = require("path");

const router = express.Router();

router.post("/newCourse", protect, isAdmin, newCourse);
router.get("/getAllCourses", protect, getAllCourses);
router.post("/uploadLecture", protect, isAdmin, uploadLecture);
router.post("/uploadAssignmentFromAdmin", protect, isAdmin, upload.single("assignmentFile"), uploadAssignmentFormAdmin);
router.get("/fetchAssignmentsById/:courseId", protect, fetchAssignmentsById);
router.post("/submitAssignment/:id", protect, upload.single("file"), submitAssignment);
router.post("/uploadQuizFromAdmin", protect, isAdmin, uploadQuizFromAdmin);
router.get("/fetchQuizesById/:courseId", protect, fetchQuizesById);
router.post("/submitQuiz/:quizId", protect, submitQuiz);
router.post("/uploadAnnouncement", protect, isAdmin, uploadAnnouncement);
router.get("/getAnnouncementsByCourseId/:courseId", protect, getAnnouncementsByCourseId);
router.get("/getTotalAnnouncements", protect, isAdmin, getTotalAnnouncements);


router.get("/download/:filename", (req, res) => {
	const file = path.join(__dirname, "../uploads/assignments", req.params.filename);
	res.download(file); // Forces file download
});


module.exports = router;