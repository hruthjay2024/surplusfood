const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded proof photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/food_surplus")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/otp", require("./routes/otpRoutes")); // ✅ OTP route

app.listen(5000, () => console.log("Server running on port 5000"));