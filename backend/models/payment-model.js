const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challanNo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ammount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'requires_payment_method'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'stripe'
  },
  paymentIntentId: {
    type: String,
    unique: true,
    sparse: true
  },
  paidAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Add index for faster queries
paymentSchema.index({ userId: 1, paymentStatus: 1 });
paymentSchema.index({ paymentIntentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);