const mongoose = require("mongoose");
const fs = require("fs");
const { isValidObjectId } = require("mongoose");
const Course = require("../models/course-model.js");

// const uploadLectureHandout = async (req, res) => {
//   try {
//     const { courseId, lectureId } = req.params;

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // find lecture inside course
//     const lecture = course.lectures.id(lectureId);

//     if (!lecture) {
//       return res.status(404).json({ message: "Lecture not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     console.log("req.file ,,", req.file)

//     // save PDF path
//     lecture.handout = {
//       fileUrl: req.file.path,
//       fileName: req.file.originalname,
//     };

//     await course.save();

//     res.status(200).json({
//       success: true,
//       message: "Handout uploaded successfully",
//       handout: lecture.handout,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const uploadLectureHandout = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lecture = course.lectures.id(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    lecture.handout = {
      fileUrl: req.file.path, // ✅ Cloudinary URL
      fileName: req.file.originalname,
    };

    await course.save();

    res.status(200).json({
      success: true,
      message: "File uploaded to Cloudinary",
      handout: lecture.handout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadLectureHandout,
};
