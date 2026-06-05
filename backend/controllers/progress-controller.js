const Quiz = require("../models/quiz-model.js");
const Assignment = require("../models/assignment-model.js");
const SubmitedQuiz = require("../models/submit-quiz-model.js");
const SubmitedAssignment = require("../models/submit-assig-model.js");
const User = require("../models/user-model.js");
const Course = require("../models/course-model.js");

const parseCourseQuery = async (course) => {
	if (!course) return null;

	if (/^[0-9a-fA-F]{24}$/.test(course)) {
		const byId = await Course.findById(course).select("courseName lectures");
		if (byId) return byId;
	}

	return await Course.findOne({ courseName: course }).select("courseName lectures");
};

const ProgressController = async (req, res) => {
	const { course } = req.params;
	const targetCourse = await parseCourseQuery(course);
	const courseName = targetCourse?.courseName || course;
	const student = await User.findById(req.user._id).select("completedLectures");

	// Quizzes Logic
	const allQuizzes = await Quiz.find({ selectedCourse: courseName }).select("submit quizId");
	const submittedQuizzes = await SubmitedQuiz.find({
		studentId: req.user._id,
		course: courseName,
	}).select("submit quizId");

	const submittedQuizIds = new Set(submittedQuizzes.map((q) => q.quizId.toString()));
	const quizzesWithSubmitStatus = allQuizzes.map((quiz) => ({
		...quiz._doc,
		submit: submittedQuizIds.has(quiz._id.toString()),
	}));

	// Assignments Logic
	const allAssignments = await Assignment.find({ selectedCourse: courseName }).select("submit assignmentId");
	const submittedAssignments = await SubmitedAssignment.find({
		studentId: req.user._id,
		course: courseName,
	}).select("submit assignmentId");

	const submittedAssignmentIds = new Set(submittedAssignments.map((a) => a.assignmentId.toString()));
	const assignmentsWithSubmitStatus = allAssignments.map((assignment) => ({
		...assignment._doc,
		submit: submittedAssignmentIds.has(assignment._id.toString()),
	}));

	// Lecture completion logic
	const totalLectures = targetCourse?.lectures?.length || 0;
	const courseCompletedLectures = student?.completedLectures?.filter((entry) =>
		entry.courseId?.toString() === targetCourse?._id?.toString(),
	) || [];
	const completedLectures = courseCompletedLectures.length;
	const completedLectureIds = courseCompletedLectures.map((entry) =>
		entry.lectureId?.toString(),
	);

	const progress = {
		quizzes: quizzesWithSubmitStatus || [],
		assignments: assignmentsWithSubmitStatus || [],
		lectureProgress: {
			totalLectures,
			completedLectures,
			completedLectureIds,
			completionRate: totalLectures ? Math.round((completedLectures / totalLectures) * 100) : 0,
		},
	};

	return res.status(200).json({
		success: true,
		progress,
	});
};

const markLectureComplete = async (req, res) => {
	const { courseId, lectureId } = req.params;
	const { watchedSeconds, videoDuration } = req.body;

	if (!videoDuration || videoDuration <= 0) {
		return res.status(400).json({
			success: false,
			message: "Invalid video duration",
		});
	}

	const requiredWatchTime = videoDuration * 0.5;
	if (!watchedSeconds || watchedSeconds < requiredWatchTime) {
		return res.status(400).json({
			success: false,
			message: "Insufficient watch time. At least 50% of the lecture must be watched.",
		});
	}

	const student = await User.findById(req.user._id);
	if (!student) {
		return res.status(404).json({ success: false, message: "Student not found" });
	}

	const alreadyCompleted = student.completedLectures.some((entry) =>
		entry.courseId?.toString() === courseId && entry.lectureId?.toString() === lectureId,
	);

	if (!alreadyCompleted) {
		student.completedLectures.push({
			courseId,
			lectureId,
			completedAt: new Date(),
		});
		await student.save();
	}

	return res.status(200).json({
		success: true,
		message: "Lecture marked as completed",
	});
};

const getStudentProgress = async (req, res) => {
	const { studentId } = req.params;
	const student = await User.findById(studentId).select("name email completedLectures role");
	if (!student) {
		return res.status(404).json({ success: false, message: "Student not found" });
	}

	const allCourses = await Course.find().select("courseName lectures assignments quizzes");
	const submittedAssignments = await SubmitedAssignment.find({ studentId }).select("assignmentId course");
	const submittedQuizzes = await SubmitedQuiz.find({ studentId }).select("quizId course");

	const progress = allCourses.map((course) => {
		const totalLectures = course?.lectures?.length || 0;
		const completedLectures = student.completedLectures.filter((entry) =>
			entry.courseId?.toString() === course._id.toString(),
		).length;
		const totalAssignments = course?.assignments?.length || 0;
		const completedAssignments = submittedAssignments.filter((item) => item.course === course.courseName).length;
		const totalQuizzes = course?.quizzes?.length || 0;
		const completedQuizzes = submittedQuizzes.filter((item) => item.course === course.courseName).length;
		const overallAttempts = totalLectures + totalAssignments + totalQuizzes;
		const overallCompleted = completedLectures + completedAssignments + completedQuizzes;

		return {
			courseId: course._id,
			courseName: course.courseName,
			totalLectures,
			completedLectures,
			totalAssignments,
			completedAssignments,
			totalQuizzes,
			completedQuizzes,
			overallProgress: overallAttempts ? Math.round((overallCompleted / overallAttempts) * 100) : 0,
		};
	});

	return res.status(200).json({
		success: true,
		student: {
			_id: student._id,
			name: student.name,
			email: student.email,
		},
		progress,
	});
};

module.exports = {
	ProgressController,
	markLectureComplete,
	getStudentProgress,
};