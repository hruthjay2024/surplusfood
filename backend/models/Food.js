const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    donorName: String,
    foodType: String,
    quantity: String,
    pickupLocation: String,
    phone: String,

    status: {
      type: String,
      default: "Pending"
    },

    // ✅ Set to true once receiver enters correct OTP
    otpVerified: {
      type: Boolean,
      default: false
    },

    // ✅ Proof photo uploaded by admin
    proofPhoto: {
      type: String,
      default: null
    },
    proofUploadedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);