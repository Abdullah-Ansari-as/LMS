const Quiz = require("../models/quiz-model.js");
const Assignment = require("../models/assignment-model.js");
const SubmitedQuiz = require("../models/submit-quiz-model.js");
const SubmitedAssignment = require("../models/submit-assig-model.js"); 

// const ProgressController = async (req, res) => {
// 	const { course } = req.params; 

// 	// Quizzes submit status logic starts here
// 	const allQuizzes = await Quiz.find({ selectedCourse: course }).select("submit quizId");
// 	if (allQuizzes.length <= 0) {
// 		return res.status(404).json({ message: "quizzes not found!" });
// 	}

// 	const submittedQuizzes = await SubmitedQuiz.find({
// 		studentId: req.user._id,
// 		course
// 	}).select("submit quizId");
// 	if (submittedQuizzes.length === 0) {
// 		return res.status(404).json({ message: "No Results/Status Found for this course!" });
// 	}

// 	// Create a Set of submitted quiz IDs for faster lookup
// 	const submittedQuizIds = new Set(
// 		submittedQuizzes.map((q) => q.quizId.toString())
// 	);

// 	// Merge: add `submit: true/false` to each quiz
// 	const quizzesWithSubmitStatus = allQuizzes.map((quiz) => {
// 		return {
// 			...quiz._doc,
// 			submit: submittedQuizIds.has(quiz._id.toString())
// 		};
// 	});


// 	// Assignments submit status logic starts here
// 	const allAssignments = await Assignment.find({ selectedCourse: course }).select("submit assignmentId");
// 	if (allAssignments.length <= 0) {
// 		return res.status(404).json({ message: "Assignments not found!" });
// 	}

// 	const submittedAssignments = await SubmitedAssignment.find({
// 		studentId: req.user._id,
// 		course
// 	}).select("submit assignmentId");
// 	if (submittedAssignments.length <= 0) {
// 		return res.status(404).json({ message: "No Results/Status Found for this course!" });
// 	}


// 	// Create a Set of submitted assignment IDs
// 	const submittedAssignmentIds = new Set(
// 		submittedAssignments.map((a) => a.assignmentId.toString())
// 	);

// 	// Add `submit: true/false` to each assignment
// 	const assignmentsWithSubmitStatus = allAssignments.map((assignment) => {
// 		return {
// 			...assignment._doc,
// 			submit: submittedAssignmentIds.has(assignment._id.toString())
// 		};
// 	});

// 	const progress = {
// 		quizzes: quizzesWithSubmitStatus,
// 		assignments: assignmentsWithSubmitStatus
// 	}

// 	return res.status(200).json({
// 		success: true,
// 		progress
// 	});

// };

const ProgressController = async (req, res) => {
	const { course } = req.params;

	// --- Quizzes Logic ---
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

	// --- Assignments Logic ---
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