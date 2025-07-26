const Grade = require("../models/grades-model.js");     

const uploadGrades = async (req, res) => {
	try {
		const {
			selectedCourse,
			selectedStudent,
			selectedStudentId,
			title,
			assignmentGrade,
			quizGrade,
			assignmentSubmited,
			quizSubmited
		} = req.body;

		if(!selectedCourse || !selectedStudent || !selectedStudentId || !title) {
			return res.status(400).json({ error: "Course, student and studentId are required." });
		}

		// Check if grade for this student/course already exists
		let existingGrade = await Grade.findOne({
			selectedStudentId,
			selectedStudent,
			selectedCourse,
			title,
		});

		if (existingGrade) {
			// Update existing grade
			if (assignmentSubmited) {
				existingGrade.assignmentGrade = assignmentGrade;
				existingGrade.assignmentSubmited = true;
			}
			if (quizSubmited) {
				existingGrade.quizGrade = quizGrade;
				existingGrade.quizSubmited = true;
			}

			await existingGrade.save();
			return res.status(200).json({ success: true, message: "Grades updated successfully." });
		} else {
			// Create new grade document
			const newGrade = new Grade({
				selectedStudent,
				selectedStudentId,
				selectedCourse,
				title,
				assignmentGrade: assignmentSubmited ? assignmentGrade : 0,
				quizGrade: quizSubmited ? quizGrade : 0,
				assignmentSubmited,
				quizSubmited,
			});

			await newGrade.save();
			return res.status(201).json({
				success: true,
				newGrade,
				message: "Grades uploaded successfully."
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to upload grades!");
	}
};

const getResultsOfQuizes = async (req, res) => {
	try {
		const { course } = req.params;
		const studentId = req.user._id;

		const quizResults = await Grade.find({
			selectedStudentId: studentId,
			selectedCourse: course,
			quizSubmited: true
		}).select("selectedStudent selectedCourse title quizGrade quizSubmited");


		return res.status(201).json({
			success: true,
			message: "Quizes retults found successfully!",
			quizResults: quizResults || []
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get quiz results!");
	}
}

const getResultsOfAssignments = async (req, res) => {
	try {
		const { course } = req.params;
		const studentId = req.user._id;

		const assignmentResults = await Grade.find({
			selectedStudentId: studentId,
			selectedCourse: course,
			assignmentSubmited: true
		}).select("selectedStudent selectedCourse title assignmentGrade assignmentSubmited");

		return res.status(201).json({
			success: true,
			message: "assignments retults found successfully!",
			assignmentResults: assignmentResults || []
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get assignments results!");
	}
}

const getGradesByStudentId = async (req, res) => {
	try {
		const grades = await Grade.find({ selectedStudentId: req.user._id });
		if (grades.length <= 0) {
			return res.status(404).json({ message: "No Grades Found for this student!" });
		}

		return res.status(201).json({
			success: true,
			message: "Grades Found for a student successfully",
			grades
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get grades by student id!");
	}
};

const getTotalGrades = async (req, res) => {
	try {
		const grades = await Grade.find();
		if(!grades) {
			return res.status(404).json({message: "Grades not found!"});
		}

		return res.status(200).json({
			success: true,
			grades: grades?.length,
			message: "Total Grades find successfully"
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get total grades!");
	}
}



module.exports = {
	uploadGrades,
	getResultsOfQuizes,
	getResultsOfAssignments,
	getGradesByStudentId,
	getTotalGrades
};
