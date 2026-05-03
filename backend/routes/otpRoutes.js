const express = require("express");
const router  = express.Router();

const otpStore = {}; // { donationId: { otp, expiresAt } }

// ===== ADMIN: Generate OTP =====
router.post("/generate/:donationId", (req, res) => {
  const { donationId } = req.params;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[donationId] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  console.log(`OTP for donation ${donationId}: ${otp}`);
  res.json({ message: "OTP generated successfully" });
});

// ===== DONOR TRACKING PAGE: Get OTP to display =====
router.get("/get/:donationId", (req, res) => {
  const { donationId } = req.params;
  const record = otpStore[donationId];

  if (!record) {
    return res.json({ otp: null, pending: false });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[donationId];
    return res.json({ otp: null, pending: false, expired: true });
  }

  const remainingSeconds = Math.floor((record.expiresAt - Date.now()) / 1000);
  res.json({ otp: record.otp, pending: true, remainingSeconds });
});

// ===== CHECK if OTP is pending =====
router.get("/pending/:donationId", (req, res) => {
  const { donationId } = req.params;
  const record = otpStore[donationId];

  if (record && Date.now() < record.expiresAt) {
    res.json({ pending: true });
  } else {
    res.json({ pending: false });
  }
});

// ===== RECEIVER via admin: Verify OTP =====
router.post("/verify/:donationId", (req, res) => {
  const { donationId } = req.params;
  const { otp } = req.body;

  const record = otpStore[donationId];

  if (!record) {
    return res.status(400).json({ message: "No OTP found. Generate a new one." });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[donationId];
    return res.status(400).json({ message: "OTP expired. Please regenerate." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  delete otpStore[donationId];
  res.json({ message: "OTP verified successfully", verified: true });
});

module.exports = router;