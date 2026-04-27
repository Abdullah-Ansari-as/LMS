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
  fetchSubmittedQuizesAdmin,
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
router.get(
  "/admin/fetchSubmittedQuizes",
  protect,
  isAdmin,
  fetchSubmittedQuizesAdmin
);
router.delete("/deleteCourseLecture/:courseId/lectures/:lectureId", protect, isAdmin, deleteCourseLecture);
router.post("/fetchSingleQuiz/:quizId", protect, fetchSingleQuiz);
router.post("/fetchAndCompareQuiz/:quizId", protect, fetchAndCompareQuiz);
// router.post("/course/:courseId/lecture/:lectureId/handout",protect,upload.single("file"),uploadLectureHandout);
router.post(
  "/course/:courseId/lecture/:lectureId/handout",
  upload.single("file"),
  uploadLectureHandout
);


const axios = require("axios");

router.get("/download", async (req, res) => {
  const { url, name } = req.query;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const response = await axios.get(url, { responseType: "stream" });
    const fileName = name || url.split("/").pop();

    // Set headers
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    }
    
    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send("Failed to download file");
  }
});

// Fallback route for /download/:identifier (handles old or broken links)
router.get("/download/:identifier", async (req, res) => {
  const { identifier } = req.params;
  const { name } = req.query;

  try {
    const Course = require("../models/course-model");
    const Assignment = require("../models/assignment-model");

    let fileUrl = "";

    // 1. Search in Course model (for lecture handouts)
    const courseWithHandout = await Course.findOne({
      "lectures.handout.fileUrl": { $regex: identifier },
    });

    if (courseWithHandout) {
      courseWithHandout.lectures.forEach((l) => {
        if (l.handout?.fileUrl?.includes(identifier))
          fileUrl = l.handout.fileUrl;
      });
    }

    // 2. Search in Assignment model (if not found in handouts)
    if (!fileUrl) {
      const assignment = await Assignment.findOne({
        assignmentFile: { $regex: identifier },
      });
      if (assignment) {
        fileUrl = assignment.assignmentFile;
      }
    }

    if (!fileUrl) {
      return res.status(404).send("File not found in database");
    }

    const response = await axios.get(fileUrl, { responseType: "stream" });
    const fileName = name || fileUrl.split("/").pop();

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    }

    response.data.pipe(res);
  } catch (error) {
    console.error("Fallback download error:", error);
    res.status(500).send("Failed to download file via fallback");
  }
});

module.exports = router;
