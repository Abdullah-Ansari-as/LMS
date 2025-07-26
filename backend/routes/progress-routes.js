const express = require("express"); 
const { protect } = require('../middlewares/auth-mid.js');
const { ProgressController } = require("../controllers/progress-controller.js");

const router = express.Router();

router.get("/:course", protect, ProgressController);

module.exports = router