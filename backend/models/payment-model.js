// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
// 	dueDate: {
// 		type: String,
// 		default: Date.now()
// 	},
// 	ammount: {
// 		type: String,
// 		required: true
// 	},
// 	description: {
// 		type: String,
// 		defalut: "Semester Fee/ Library Charges"
// 	},
// 	challanNo:{
// 		type: String,
// 		default: "123456789"
// 	}
// });

// module.exports = mongoose.model("Payment", paymentSchema); 


const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    // Existing fields
    dueDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    },
    ammount: {
        type: Number, // Changed from String to Number
        required: true
    },
    description: {
        type: String,
        default: "Semester Fee/ Library Charges"
    },
    challanNo: {
        type: String,
        default: () => `CH${Date.now().toString().slice(-6)}`
    },
    
    // New fields for payment tracking
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: false // Make optional for backward compatibility
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'processing'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        default: 'stripe'
    },
    paymentIntentId: {
        type: String,
        default: null
    },
    paidAt: {
        type: Date,
        default: null
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
paymentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Payment", paymentSchema);