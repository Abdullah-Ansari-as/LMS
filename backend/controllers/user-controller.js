const User = require("../models/user-model.js");
const Grade = require("../models/grades-model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary.js")

const register = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				message: "User already exist Please Signup first!"
			})
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		user = new User({
			name,
			email,
			password: hashedPassword
		})

		await user.save();

		// generate token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
		// console.log(token);

		return res.status(200).json({
			token,
			user,
			message: "User registered successfully!",
			success: true
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to register a user!")
	}
}

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "Please signup first!" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(404).json({
				message: "Invalid credentials",
				success: false
			});
		}

		user.loginHistory.push(Date.now());
		await user.save();

		const userToReturn = {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			loginHistory: user.loginHistory,
			profilePicture: user.profilePicture
		};

		// generate token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
		console.log(token);

		return res.status(200).json({
			token,
			user: userToReturn,
			message: "User Loged In successfully!",
			success: true
		});

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to Login a user!")
	}
}

const logout = async (req, res) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
			secure: process.env.NODE_ENV === "production",
		}).status(200).json({
			message: "Logged out successfully",
			success: true
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to logout a user!")
	}
}

const getAllStudents = async (_, res) => {
	try {
		const user = await User.find().select("-password");
		if (!user) {
			return res.status(404).json({ message: "Failed to get all users!" });
		}

		return res.status(201).json({
			message: "Successfully find all students",
			user,
			success: true
		})

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to get all users!")
	}
}

const getLoginHistory = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("loginHistory name email");
		if (!user) {
			return res.status(404).json({ message: "Failed to find a user!" })
		}

		return res.status(201).json({
			message: "Successfully find login history",
			user,
			success: true
		})
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to find Login History!")
	}
}

const changePassword = async (req, res) => {
	const { email, currentPassword, newPassword } = req.body;
	try {
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "user not found!" })
		}

		const isValidOldPassword = await bcrypt.compare(currentPassword, user.password);
		if (!isValidOldPassword) {
			return res.status(422).json({ message: "Invalid current Password please Enter a valid password" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;

		await user.save();

		return res.status(201).json({ message: "Password updated successfully!", success: true });

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to update new password!")
	}
}

const uploadProfilePicture = async (req, res) => {
	try {
		const { file } = req.body;
		const studentId = req.user._id;

		if (!file) {
			return res.status(404).json({ message: "profile picture file not found!" });
		}

		const student = await User.findById(studentId).select("-password");
		if(!student) {
			return res.status(404).json({message: "Student not found!"});
		}

		// upload image on cloudinary 

		const cloudResponse = await cloudinary.uploader.upload(file);
		if (!cloudResponse) {
			return res.status(500).json({ message: "Failed while upload on cloudinary!" })
		}

		student.profilePicture = cloudResponse.secure_url;

		await student.save();

		return res.status(201).json({
			success: true,
			updatedStudent: student,
			message: "profile picture uploaded successfully"
		})

	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to upload profile picture!");
	}
}

const getTopPerformingStudents = async (_, res) => {
	try {
		const topStudents = await Grade.aggregate([
			{
				$group: {
					_id: "$selectedStudentId",
					totalAssignmentGrade: { $sum: "$assignmentGrade" },
					totalQuizGrade: { $sum: "$quizGrade" },
					totalGrade: {
						$sum: { $add: ["$assignmentGrade", "$quizGrade"] }
					}
				}
			},
			{
				$lookup: {
					from: "users", // name of your user collection
					localField: "_id",
					foreignField: "_id",
					as: "userInfo"
				}
			},
			{ $unwind: "$userInfo" },
			{
				$project: {
					name: "$userInfo.name",
					email: "$userInfo.email",
					profilePicture: "$userInfo.profilePicture",
					average: "$totalGrade"
				}
			},
			{ $sort: { average: -1 } },
			{ $limit: 4 } // Change this as needed
		]);

		res.status(200).json({
			success: true,
			topStudents,
			message: "Top performing students fetch successfully!"
		});
	} catch (error) {
		console.error("Error fetching top students:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = {
	register,
	login,
	logout,
	getAllStudents,
	getLoginHistory,
	changePassword,
	uploadProfilePicture,
	getTopPerformingStudents
}