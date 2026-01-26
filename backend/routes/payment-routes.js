const express = require("express");
const { isAdmin } = require("../middlewares/admin-mid.js");
const { protect } = require('../middlewares/auth-mid.js');
const { payment, getPayment, createPaymentIntent, updatePaymentStatus } = require("../controllers/payment-controller.js");

const router = express.Router();

router.post("/upload-payment", protect, isAdmin, payment);
router.get("/get-payment", getPayment);
router.post("/createPaymentIntent", createPaymentIntent);
router.post("/update-status", updatePaymentStatus);

module.exports = router;
