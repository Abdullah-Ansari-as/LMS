const Quiz = require("../models/quiz-model.js");
const Assignment = require("../models/assignment-model.js");
const SubmitedQuiz = require("../models/submit-quiz-model.js");
const SubmitedAssignment = require("../models/submit-assig-model.js"); 

const ProgressController = async (req, res) => {
	const { course } = req.params;

	// Quizzes Logic
	const allQuizzes = await Quiz.find({ selectedCourse: course }).select("submit quizId");

	const submittedQuizzes = await SubmitedQuiz.find({
		studentId: req.user._id,
		course
	}).select("submit quizId");

	const submittedQuizIds = new Set(
		submittedQuizzes.map((q) => q.quizId.toString())
	);

	const quizzesWithSubmitStatus = allQuizzes.map((quiz) => ({
		...quiz._doc,
		submit: submittedQuizIds.has(quiz._id.toString())
	}));

	// Assignments Logic
	const allAssignments = await Assignment.find({ selectedCourse: course }).select("submit assignmentId");

	const submittedAssignments = await SubmitedAssignment.find({
		studentId: req.user._id,
		course
	}).select("submit assignmentId");

	const submittedAssignmentIds = new Set(
		submittedAssignments.map((a) => a.assignmentId.toString())
	);

	const assignmentsWithSubmitStatus = allAssignments.map((assignment) => ({
		...assignment._doc,
		submit: submittedAssignmentIds.has(assignment._id.toString())
	}));

	// Final progress object
	const progress = {
		quizzes: quizzesWithSubmitStatus || [],
		assignments: assignmentsWithSubmitStatus || []
	};

	return res.status(200).json({
		success: true,
		progress
	});
};


module.exports = { ProgressController }