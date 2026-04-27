const express = require("express");
const { isAdmin } = require("../middlewares/admin-mid.js");
const { protect } = require('../middlewares/auth-mid.js');
const {
  newCourse,
  uploadLecture,
  getAllCourses,
  uploadAssignmentFormAdmin,
  submitAssignment,
  uploadQuizFromAdmin,
  fetchAssignmentsById,
  fetchQuizesById,
  submitQuiz,
  uploadAnnouncement,
  getAnnouncementsByCourseId,
  getTotalAnnouncements,
  fetchSubmittedAssignments,
  fetchSubmittedAssignmentsAdmin,
  fetchSubmittedQuizes,
  deleteCourseLecture,
  fetchSingleQuiz,
  fetchAndCompareQuiz,
} = require("../controllers/course-controller.js");
const { upload } = require("../utils/uploadAssignment.js")
const path = require("path");
const { uploadLectureHandout } = require("../controllers/pdf-controller.js");

const router = express.Router();

router.post("/newCourse", protect, isAdmin, newCourse);
router.get("/getAllCourses", protect, getAllCourses);
router.post("/uploadLecture", protect, isAdmin, upload.single("handoutFile"), uploadLecture);
router.post("/uploadAssignmentFromAdmin", protect, isAdmin, upload.single("assignmentFile"), uploadAssignmentFormAdmin);
router.get("/fetchAssignmentsById/:courseId", protect, fetchAssignmentsById);
router.post("/submitAssignment/:id", protect, upload.single("file"), submitAssignment);
router.post("/uploadQuizFromAdmin", protect, isAdmin, uploadQuizFromAdmin);
router.get("/fetchQuizesById/:courseId", protect, fetchQuizesById);
router.post("/submitQuiz/:quizId", protect, submitQuiz);
router.post("/uploadAnnouncement", protect, isAdmin, uploadAnnouncement);
router.get("/getAnnouncementsByCourseId/:courseId", protect, getAnnouncementsByCourseId);
router.get("/getTotalAnnouncements", protect, isAdmin, getTotalAnnouncements);
router.get("/fetchSubmittedAssignments", protect, fetchSubmittedAssignments);
router.get(
  "/admin/fetchSubmittedAssignments",
  protect,
  isAdmin,
  fetchSubmittedAssignmentsAdmin
);
router.get("/fetchSubmittedQuizes", protect, fetchSubmittedQuizes);
router.delete("/deleteCourseLecture/:courseId/lectures/:lectureId", protect, isAdmin, deleteCourseLecture);
router.post("/fetchSingleQuiz/:quizId", protect, fetchSingleQuiz);
router.post("/fetchAndCompareQuiz/:quizId", protect, fetchAndCompareQuiz);
// router.post("/course/:courseId/lecture/:lectureId/handout",protect,upload.single("file"),uploadLectureHandout);
router.post(
  "/course/:courseId/lecture/:lectureId/handout",
  upload.single("file"),
  uploadLectureHandout
);


router.get("/download", (req, res) => {
  const fileUrl = req.query.url;
  res.redirect(fileUrl); // ✅ redirect to Cloudinary
});

module.exports = router;
