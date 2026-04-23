const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lms-handouts",
    resource_type: "raw", // for pdf, docx, ppt
  },
});

const upload = multer({ storage });

module.exports = upload;