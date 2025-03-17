const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

console.log("✅ Auth.js is being loaded!");

// ✅ Validate MongoDB Connection Once on Startup (Instead of Every Request)
if (mongoose.connection.readyState !== 1) {
  console.error("❌ Database is not connected at server start!");
} else {
  console.log("✅ MongoDB is ready.");
}

router.use(async (req, res, next) => {
  console.log("🔍 Checking MongoDB Connection State:", mongoose.connection.readyState);

  if (mongoose.connection.readyState !== 1) {
    console.error("❌ Database is not ready! Request blocked.");
    return res.status(503).json({ error: "Database connection is not ready. Try again later." });
  }

  try {
    await mongoose.connection.db.admin().ping();  // <-- Ensure MongoDB is actually responding
    console.log("✅ Database is responsive.");
  } catch (error) {
    console.error("❌ Database connection check failed:", error);
    return res.status(503).json({ error: "Database connection issue. Try again later." });
  }

  next();
});

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  console.log("✅ Signup route triggered!");

  const { email, password } = req.body;
  console.log(`📩 Received email: ${email}`);

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      console.log("❌ User already exists:", user);
      return res.status(400).json({ msg: "User already exists" });
    }

    console.log("🛠 Creating a new user...");

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("🔑 Hashed Password:", hashedPassword);

    // Create & save user
    user = new User({ email, password: hashedPassword });
    await user.save();

    console.log("✅ User successfully saved!", user);

    // Ensure JWT Secret is Set
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET is not set in the environment!");
      return res.status(500).json({ error: "Internal Server Error: Missing JWT Secret" });
    }

    // Generate JWT token
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("🔥 ERROR in signup:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;