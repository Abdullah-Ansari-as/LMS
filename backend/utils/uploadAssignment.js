const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/assignments");
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const uniqueName = Date.now() + "-" + file.originalname;
		cb(null, uniqueName);
	},
});

const upload = multer({ storage });
module.exports = {upload};
