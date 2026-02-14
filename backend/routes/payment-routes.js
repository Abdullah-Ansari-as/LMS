const express = require("express");
const { isAdmin } = require("../middlewares/admin-mid.js");
const { protect } = require("../middlewares/auth-mid.js");
const {
  payment,
  getPayment,
  createPaymentIntent,
  updatePaymentStatus,
} = require("../controllers/payment-controller.js");

const router = express.Router();

// Protected routes
router.get("/getPayment", protect, getPayment);
router.post("/createPaymentIntent", protect, createPaymentIntent);
router.post("/update-status", protect, updatePaymentStatus);

// Admin only route
router.post("/upload-payment", protect, isAdmin, payment);

module.exports = router;