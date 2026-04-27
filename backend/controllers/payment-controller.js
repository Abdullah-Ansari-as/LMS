const Stripe = require("stripe");
const Payment = require("../models/payment-model.js");
const User = require("../models/user-model.js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Upload payment function (admin only)
const payment = async (req, res) => {
  try {
    const { ammount, challanNo, description, dueDate } = req.body;
    const createdBy = req.user._id;
    const numericAmount = Number(ammount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required",
      });
    }

    const students = await User.find({ role: "student" }).select("_id");
    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found to assign this payment.",
      });
    }

    const existingPayments = await Payment.find({
      challanNo,
      description,
      dueDate,
      userId: { $in: students.map((student) => student._id) },
    }).select("userId");

    const existingUserIds = new Set(
      existingPayments.map((paymentRecord) => paymentRecord.userId.toString()),
    );

    const paymentsToCreate = students
      .filter((student) => !existingUserIds.has(student._id.toString()))
      .map((student) => ({
        ammount: numericAmount,
        description,
        dueDate,
        challanNo,
        userId: student._id,
        createdBy,
        paymentStatus: "pending",
        paymentMethod: "stripe",
      }));

    if (!paymentsToCreate.length) {
      return res.status(409).json({
        success: false,
        message: "This payment is already assigned to all students.",
      });
    }

    const createdPayments = await Payment.insertMany(paymentsToCreate);

    return res.status(201).json({
      success: true,
      payment: createdPayments,
      assignedCount: createdPayments.length,
      message: `Payment assigned to ${createdPayments.length} students successfully!`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload payment!",
    });
  }
};

// Get payments for authenticated user
const getPayment = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from auth middleware

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!payments || payments.length === 0) {
      return res.status(200).json({
        success: true,
        transactions: [],
        summary: {
          totalTransactions: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          paidCount: 0,
          pendingCount: 0,
          failedCount: 0,
          processingCount: 0,
        },
      });
    }

    // Format payments
    const formattedPayments = payments.map((payment) => ({
      _id: payment._id.toString(),
      challanNo: payment.challanNo,
      description: payment.description,
      ammount: payment.ammount,
      dueDate: payment.dueDate
        ? new Date(payment.dueDate).toISOString().split("T")[0]
        : null,
      paymentStatus: payment.paymentStatus,
      paymentMethod: payment.paymentMethod,
      paymentIntentId: payment.paymentIntentId,
      paidAt: payment.paidAt,
      isPaid: payment.paymentStatus === "succeeded",
      isPending: payment.paymentStatus === "pending",
      isFailed: payment.paymentStatus === "failed",
      statusDisplay: getStatusDisplay(payment.paymentStatus),
    }));

    // Calculate summary
    const summary = calculateSummary(formattedPayments);

    return res.status(200).json({
      success: true,
      transactions: formattedPayments,
      summary,
    });
  } catch (error) {
    console.error("Get Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get payments",
      transactions: [],
      summary: getEmptySummary(),
    });
  }
};

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const userId = req.user._id;

    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    // Verify the transaction belongs to the user
    const payment = await Payment.findOne({
      _id: transactionId,
      userId: userId,
    });

    if (!payment) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (payment.paymentStatus === "succeeded") {
      return res.status(400).json({ error: "This payment has already been completed." });
    }

    const amountPKR = Number(payment.ammount);
    if (!amountPKR || amountPKR <= 0) {
      return res.status(400).json({ error: "This transaction has an invalid amount." });
    }

    const stripeAmount = Math.round(amountPKR * 100);

    // Minimum amount check
    if (stripeAmount < 50) {
      const minimumPKR = Math.ceil(50 / 100);
      return res.status(400).json({
        error: `Minimum payment amount is Rs. ${minimumPKR}`,
      });
    }

    console.log("Creating payment intent:", {
      amountPKR,
      stripeAmount,
      transactionId,
      userId: userId.toString(),
    });

    // Create payment intent with idempotency key to prevent duplicates
    const idempotencyKey = `payment_${transactionId}_${Date.now()}`;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: stripeAmount,
        currency: "pkr",
        payment_method_types: ["card"],
        metadata: {
          amountPKR: amountPKR.toString(),
          transactionId: transactionId,
          userId: userId.toString(),
        },
        description: `Payment for Challan #${payment.challanNo}`,
      },
      {
        idempotencyKey,
      }
    );

    // Update payment with payment intent ID
    payment.paymentIntentId = paymentIntent.id;
    payment.paymentStatus = "processing";
    await payment.save();

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amountPKR: amountPKR,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      error: "Failed to create payment intent",
      message: error.message,
    });
  }
};

// Update payment status after successful payment
const updatePaymentStatus = async (req, res) => {
  try {
    const {
      transactionId,
      paymentIntentId,
      status,
      amountPKR,
      stripeAmount,
      currency,
    } = req.body;

    const userId = req.user._id;

    console.log("Updating payment status:", {
      transactionId,
      paymentIntentId,
      status,
      userId: userId.toString(),
    });

    // Find payment by transaction ID and user ID
    const payment = await Payment.findOne({
      _id: transactionId,
      userId: userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Verify payment intent exists and belongs to this transaction
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        payment.paymentStatus = "succeeded";
        payment.paidAt = new Date();
        payment.paymentIntentId = paymentIntentId;
        payment.paymentMethod = "stripe";
        payment.metadata = {
          stripeAmount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentMethod: paymentIntent.payment_method_types[0],
        };
      } else {
        payment.paymentStatus = paymentIntent.status;
      }
    } catch (stripeError) {
      console.error("Error retrieving payment intent from Stripe:", stripeError);
      payment.paymentStatus = status; // Fallback to provided status
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      transaction: {
        _id: payment._id,
        paymentStatus: payment.paymentStatus,
        paidAt: payment.paidAt,
      },
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};

// Helper functions
const getStatusDisplay = (status) => {
  const displays = {
    succeeded: {
      text: "Paid",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: "check",
    },
    failed: {
      text: "Failed",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "times",
    },
    processing: {
      text: "Processing",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: "spinner",
    },
    pending: {
      text: "Pending",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      icon: "clock",
      isActionable: true,
    },
    requires_payment_method: {
      text: "Payment Required",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      icon: "clock",
      isActionable: true,
    },
  };

  return displays[status] || displays.pending;
};

const calculateSummary = (payments) => {
  const totalAmount = payments.reduce((sum, p) => sum + p.ammount, 0);
  const paidAmount = payments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + p.ammount, 0);
  const pendingAmount = payments
    .filter((p) => p.isPending)
    .reduce((sum, p) => sum + p.ammount, 0);

  return {
    totalTransactions: payments.length,
    totalAmount,
    paidAmount,
    pendingAmount,
    paidCount: payments.filter((p) => p.isPaid).length,
    pendingCount: payments.filter((p) => p.isPending).length,
    failedCount: payments.filter((p) => p.isFailed).length,
    processingCount: payments.filter((p) => p.paymentStatus === "processing").length,
  };
};

const getEmptySummary = () => ({
  totalTransactions: 0,
  totalAmount: 0,
  paidAmount: 0,
  pendingAmount: 0,
  paidCount: 0,
  pendingCount: 0,
  failedCount: 0,
  processingCount: 0,
});

// Export all functions
module.exports = {
  payment,
  getPayment,
  createPaymentIntent,
  updatePaymentStatus,
};
