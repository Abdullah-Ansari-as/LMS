const express = require("express");
const { isAdmin } = require("../middlewares/admin-mid.js");
const { protect } = require('../middlewares/auth-mid.js');
const { uploadGrades, getGradesByStudentId, getResultsOfQuizes, getResultsOfAssignments, getTotalGrades } = require("../controllers/grades-controller.js");

const router = express.Router();

router.post("/uploadGrades", protect, isAdmin, uploadGrades)
router.get("/getResultsOfQuizes/:course", protect, getResultsOfQuizes)
router.get("/getResultsOfAssignments/:course", protect, getResultsOfAssignments)
router.get("/getGradesByStudentId", protect, getGradesByStudentId);
router.get("/getTotalGrades", protect, isAdmin, getTotalGrades);


module.exports = router;