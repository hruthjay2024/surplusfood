const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const otpStore = {}; // { donationId: { otp, expiresAt } }

// ===== EMAIL TRANSPORTER (Gmail) =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD  // 16-digit App Password from Google
  }
});

// ===== RECEIVER (admin): Generate OTP → send email to fixed address =====
router.post("/generate/:donationId", async (req, res) => {
  const { donationId } = req.params;
  const { donorName, foodType, quantity, pickupLocation } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[donationId] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  try {
    await transporter.sendMail({
      from: `"Food Surplus" <${process.env.GMAIL_USER}>`,
      to: process.env.OTP_RECEIVER_EMAIL,
      subject: "🔐 Food Pickup OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background: #2e7d32; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">🍱 Food Surplus</h2>
            <p style="color: #c8e6c9; margin: 5px 0 0;">Pickup Verification</p>
          </div>
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px;">A receiver has arrived to collect the following donation:</p>
            <table style="width:100%; background:#f9f9f9; border-radius:8px; padding:14px; margin: 16px 0; border-collapse:collapse;">
              <tr><td style="padding:6px 10px; color:#555; font-size:14px;"><b>Donor</b></td><td style="padding:6px 10px; color:#222; font-size:14px;">${donorName || "—"}</td></tr>
              <tr><td style="padding:6px 10px; color:#555; font-size:14px;"><b>Food</b></td><td style="padding:6px 10px; color:#222; font-size:14px;">${foodType || "—"}</td></tr>
              <tr><td style="padding:6px 10px; color:#555; font-size:14px;"><b>Quantity</b></td><td style="padding:6px 10px; color:#222; font-size:14px;">${quantity || "—"}</td></tr>
              <tr><td style="padding:6px 10px; color:#555; font-size:14px;"><b>Address</b></td><td style="padding:6px 10px; color:#222; font-size:14px;">${pickupLocation || "—"}</td></tr>
            </table>
            <p style="color: #333; font-size: 15px; margin-bottom: 8px;">Your OTP to confirm this pickup is:</p>
            <div style="background: #e8f5e9; border: 2px dashed #2e7d32; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 20px;">
              <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #1b5e20;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 13px;">⏱ This OTP is valid for <b>10 minutes</b>. Do not share it with anyone other than the receiver at your location.</p>
          </div>
          <div style="background: #f5f5f5; padding: 14px; text-align: center;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">Food Surplus Initiative — Reducing waste, feeding lives</p>
          </div>
        </div>
      `
    });

    console.log(`OTP ${otp} sent to ${process.env.OTP_RECEIVER_EMAIL} for donation ${donationId}`);
    res.json({ message: `OTP sent to ${process.env.OTP_RECEIVER_EMAIL}` });

  } catch (err) {
    console.error("Email error:", err.message);
    // Dev fallback — show OTP on screen if email fails
    res.status(500).json({
      message: "Email failed. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env",
      devOtp: otp // ⚠️ Remove in production
    });
  }
});

// ===== CHECK if OTP is currently pending for a donation =====
// Called by home.html every 15s to show the floating verify button
router.get("/pending/:donationId", (req, res) => {
  const { donationId } = req.params;
  const record = otpStore[donationId];

  if (record && Date.now() < record.expiresAt) {
    res.json({ pending: true });
  } else {
    res.json({ pending: false });
  }
});

// ===== DONOR: Verify OTP entered in the home page popup =====
router.post("/verify/:donationId", (req, res) => {
  const { donationId } = req.params;
  const { otp } = req.body;

  const record = otpStore[donationId];

  if (!record) {
    return res.status(400).json({ message: "No OTP found. Ask receiver to generate one." });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[donationId];
    return res.status(400).json({ message: "OTP expired. Ask receiver to regenerate." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  delete otpStore[donationId];
  res.json({ message: "OTP verified successfully", verified: true });
});

module.exports = router;