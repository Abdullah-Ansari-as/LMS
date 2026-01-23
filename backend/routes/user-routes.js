const express = require('express');
const {
	register,
	login,
	logout,
	getAllStudents,
	getLoginHistory,
	changePassword,
	getTopPerformingStudents,
	uploadProfilePicture
} = require('../controllers/user-controller');
const { isAdmin } = require("../middlewares/admin-mid.js");
const { protect } = require('../middlewares/auth-mid.js');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getAllStudents", protect, isAdmin, getAllStudents);
router.get("/getLoginHistory", protect, getLoginHistory);
router.post("/changePassword", changePassword);
router.post("/uploadProfilePicture", protect, uploadProfilePicture);
router.get("/getTopPerformingStudents", protect, isAdmin, getTopPerformingStudents);

module.exports = router