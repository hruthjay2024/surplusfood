const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    donorName: String,
    foodType: String,
    quantity: String,
    pickupLocation: String,
    phone: String,
    userEmail: String, // ✅ links donation to logged-in user for filtering

    status: {
      type: String,
      default: "Pending"
    },

    otpVerified: {
      type: Boolean,
      default: false
    },

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