const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===== MULTER SETUP =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/proof";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `proof_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  }
});

/* ADD DONATION */
router.post("/add", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json({ message: "Donation saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving donation" });
  }
});

/* GET ALL DONATIONS */
router.get("/all", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching" });
  }
});

/* UPDATE STATUS */
router.put("/status/:id", async (req, res) => {
  try {
    await Food.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* MARK OTP VERIFIED */
router.put("/otp-verified/:id", async (req, res) => {
  try {
    await Food.findByIdAndUpdate(req.params.id, { otpVerified: true });
    res.json({ message: "Marked as OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

/* UPLOAD PROOF PHOTO */
router.post("/upload-proof/:id", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const photoPath = `/${req.file.path.replace(/\\/g, "/")}`;
    await Food.findByIdAndUpdate(req.params.id, {
      proofPhoto: photoPath,
      proofUploadedAt: new Date()
    });
    res.json({ message: "Proof photo uploaded", photoPath });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;