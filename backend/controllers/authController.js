const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: "user"
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hard-coded admin
    if (email === "hruthikg42@gmail.com" && password === "12345") {
      return res.status(200).json({
        message: "Admin login successful",
        role: "admin",
        email: "hruthikg42@gmail.com",
        name: "Admin"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      role: "user",
      email: user.email,   // ✅ return email so frontend can store it
      name: user.name      // ✅ return name
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
};