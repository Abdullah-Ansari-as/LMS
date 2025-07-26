const Assignment = require("../models/assignment-model.js");
const Course = require("../models/course-model.js");
const SubmitedAssignment = require("../models/submit-assig-model.js");
const Quiz = require("../models/quiz-model.js");
const SubmitedQuiz = require("../models/submit-quiz-model.js");
const Announcement = require("../models/announcement-model.js");
const fs = require("fs"); 


const newCourse = async (req, res) => {
	const { courseName, description, creditHours, instructor } = req.body; //**** reminder: instructor is an object

	try {
		const existedCourse = await Course.findOne({ courseName });
		if (existedCourse) {
			return res.status(409).json({ message: "Course already exist please Create new course" });
		}

		const newCourse = new Course({
			courseName,
			description,
			creditHours,
			instructor
		});

		if (!newCourse) {
			return res.status(501).json({ message: "courses are not stored in db!" });
		}
		await newCourse.save();

		return res.status(201).json({
			message: "New Course created Successfully",
			newCourse,
			success: true
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to add new course!");
	}
};

const getAllCourses = async (_, res) => {
	try {
		const allCourses = await Course.find();
		if (!allCourses) {
			return res.status(404).json({ message: "Failed to find all courses!" })
		}

		return res.status(201).json({
			allCourses,
			success: true
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get all courses!");
	}
}

const uploadLecture = async (req, res) => {
	const { course, lectureTitle, lectureUrl } = req.body;
	try {
		// find course by name
		const existingCourse = await Course.findOne({ courseName: course });
		if (!existingCourse) {
			return res.status(404).json({ message: "Course not found" });
		}

		existingCourse.lectures.push({ lectureTitle, lectureUrl });

		const savedCourse = await existingCourse.save();

		res.status(200).json({
			message: "Lecture upload successfully",
			course: savedCourse,
			success: true
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to upload a lecture!");
	}
}

const uploadAssignmentFormAdmin = async (req, res) => {
	try {
		const { dueDate, totalMarks, selectedCourse } = req.body;
		const filePath = req.file?.path; // uploaded file path

		if (!filePath) {
			return res.status(400).json({ message: "File is required" });
		}

		const assignment = new Assignment({
			assignmentFile: filePath,
			dueDate,
			totalMarks,
			selectedCourse
		});

		const course = await Course.findOne({ courseName: selectedCourse });
		if (!course) {
			return res.status(404).json({ message: "course not found for assignment!" });
		}

		course.assignments.push(assignment._id);

		await course.save();

		await assignment.save();

		return res.status(200).json({
			success: true,
			message: "Assignment uploaded successfully",
			assignment
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to upload an assignment from admin!");
	}
}

const fetchAssignmentsById = async (req, res) => {
	try {
		const { courseId } = req.params; // this is the course id

		const assignments = await Course.findById(courseId).populate("assignments").select("assignments");
		if (!assignments) {
			return res.status(404).json({ message: "Assignments not found" });
		}

		return res.status(201).json({
			success: true,
			message: "Successfully Fetch assignmets by course id",
			assignments
		})
	} catch (error) {
		console.error(error);
		res.status(500).json("Failed to fetch assignments by id!")
	}
}

const submitAssignment = async (req, res) => {
	try {
		const { id } = req.params; // Admin's assignment ID from URL
		const filePath = req.file?.path; // file uploaded
		const studentId = req.user._id; // comes from JWT auth middleware

		if (!filePath) {
			return res.status(400).json({ message: "File is required" });
		}

		// 1. Find the assignment, this is the assignment uploaded by admin.
		const assignment = await Assignment.findById(id);
		if (!assignment) {
			// Delete uploaded file if assignment not found
			fs.unlink(filePath, (err) => {
				if (err) console.error("Failed to delete file:", err);
			});
			return res.status(404).json({ message: "Assignment not found" });
		}

		// 2. Check if already submitted
		const alreadySubmitted = await SubmitedAssignment.findOne({
			studentId,
			assignmentId: id,
		});
		if (alreadySubmitted) {
			// Delete uploaded file if assignment already submitted
			fs.unlink(filePath, (err) => {
				if (err) console.error("Failed to delete file:", err);
			});
			return res.status(400).json({ message: "You have already submitted this assignment." });
		}

		// 3. Create a new submission
		const submission = new SubmitedAssignment({
			studentId,
			assignmentId: id,
			course: assignment.selectedCourse,
			file: filePath,
			submit: true,
		});

		await submission.save();

		res.status(200).json({
			success: true,
			message: "Assignment submitted successfully",
			submission,
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to submit assignment");
	}
}

const uploadQuizFromAdmin = async (req, res) => {
	try {
		const { selectedCourse, dueDate, totalMarks, quizQuestions } = req.body;

		const quiz = new Quiz({
			selectedCourse,
			dueDate,
			totalMarks,
			quizQuestions
		})

		const course = await Course.findOne({ courseName: selectedCourse });
		if (!course) {
			return res.status(404).json({ message: "course not found for assignment!" });
		}

		course.quizzes.push(quiz._id);

		await course.save();

		await quiz.save();

		return res.status(201).json({
			message: "quiz uploaded successfully",
			success: true,
			quiz
		})
	} catch (error) {
		console.error(error);
		res.status(500).send('Failed to upload a quiz from admin! May be "Correct option is required!"');
	}
}

const fetchQuizesById = async (req, res) => {
	try {
		const { courseId } = req.params;

		const quizzes = await Course.findById(courseId).populate("quizzes").select("quizzes");
		if (!quizzes) {
			return res.status(404).json({ message: "Quizzes not found!" });
		}

		return res.status(201).json({
			success: true,
			message: "Successfully fetch quizzes by course id",
			quizzes
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get quizzes by id!");
	}
}

const submitQuiz = async (req, res) => {
	try {
		const { quizId } = req.params; // this is the quiz id uploaded by admin
		const studentId = req.user._id;
		const { course, quizQuestions } = req.body;

		// check if already submited
		const Quiz = await SubmitedQuiz.findOne({ quizId, studentId });
		if (Quiz) {
			return res.status(400).json({ message: "You have already submitted this quiz." });
		}

		const submission = new SubmitedQuiz({
			studentId,
			quizId,
			course,
			quizQuestions,
			submit: true
		})

		await submission.save();

		return res.status(201).json({
			success: true,
			message: "Quiz submitted successfully",
			submission
		})

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to submit a quiz!");
	}
};

const uploadAnnouncement = async (req, res) => {
	try {
		const { selectedCourse, announcement, title } = req.body;

		const course = await Course.findOne({ courseName: selectedCourse });
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		const newAnnouncement = new Announcement({
			title,
			announcement,
			selectedCourse
		})

		await newAnnouncement.save();

		course.announcements.push(newAnnouncement._id);

		await course.save();

		return res.status(201).json({
			success: true,
			message: "Annoucement uploaded successfully!",
			newAnnouncement
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to upload Announcement!");
	}
}

const getAnnouncementsByCourseId = async (req, res) => {
	try {
		const { courseId } = req.params;
		const courseAnnouncements = await Course.findById(courseId).populate("announcements").select("announcements");
		if (!courseAnnouncements) {
			return res.status(404).json({ message: "Course not found!" });
		}

		return res.status(201).json({
			success: true,
			message: "Successfully get announcements by courseId",
			courseAnnouncements
		})

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get announcement by couseId!");
	}
}

const getTotalAnnouncements = async (_, res) => {
	try {
		const announcements = await Announcement.find();
		if(!announcements) {
			return res.status(404).json({message: "Total Announcements not found!"});
		}
		return res.status(200).json({
			message: "Total Announcements found successfully",
			success: true,
			announcements
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get total announcement!");
	}
}


const fetchSubmittedAssignments = async (_, res) => {
	try {
		const submittedAssignments = await SubmitedAssignment.find();
		if(!submittedAssignments) {
			return res.status(404).json({message: "SubmittedAssignments not found!"});
		}
		return res.status(200).json({
			success: true,
			message: "Submitted Assignments fetched successfully",
			submittedAssignments
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to fetch submitted Assignments!");
	}
}
const fetchSubmittedQuizes = async (_, res) => {
	try {
		const submittedQuizes = await SubmitedQuiz.find();
		if(!submittedQuizes) {
			return res.status(404).json({message: "SubmittedQuizes not found!"});
		}
		return res.status(200).json({
			success: true,
			message: "Submitted Quizes fetched successfully",
			submittedQuizes
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to fetch submitted Quizes!");
	}
}


module.exports = {
	newCourse,
	getAllCourses,
	uploadLecture,
	uploadAssignmentFormAdmin,
	fetchAssignmentsById,
	submitAssignment,
	uploadQuizFromAdmin,
	fetchQuizesById,
	submitQuiz,
	uploadAnnouncement,
	getAnnouncementsByCourseId,
	getTotalAnnouncements,
	fetchSubmittedAssignments,
	fetchSubmittedQuizes
}