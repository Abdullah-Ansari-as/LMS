const express = require("express");  
const { NbAnnounce, getAllNbAnnouncements } = require("../controllers/nb-announc-controller.js");

const router = express.Router();

router.post("/nbannounce", NbAnnounce);
router.get("/getAllNbAnnouncements", getAllNbAnnouncements);

module.exports = router