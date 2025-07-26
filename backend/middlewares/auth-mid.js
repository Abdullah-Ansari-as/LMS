const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const protect = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized: No token" });
	}

	const token = authHeader.split(" ")[1];
	// console.log(token)

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.user = await User.findById(decoded.userId).select("-password");
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};


module.exports = { protect };