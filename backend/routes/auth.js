const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { Client } = require("pg");

const router = express.Router();

console.log("✅ Auth.js is being loaded!");

// ✅ Setup PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL,  // Heroku provides this automatically
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL!");
  })
  .catch(err => {
    console.error("❌ Error connecting to PostgreSQL:", err);
  });

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  console.log("✅ Signup route triggered!");

  const { email, password } = req.body;
  console.log(`📩 Received email: ${email}`);

  try {
    // Check if user exists in PostgreSQL
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      console.log("❌ User already exists:", result.rows[0]);
      return res.status(400).json({ msg: "User already exists" });
    }

    console.log("🛠 Creating a new user...");

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("🔑 Hashed Password:", hashedPassword);

    // Insert the new user into the PostgreSQL database
    await client.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

    console.log("✅ User successfully saved!");

    // Ensure JWT Secret is Set
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET is not set in the environment!");
      return res.status(500).json({ error: "Internal Server Error: Missing JWT Secret" });
    }

    // Generate JWT token
    const token = jwt.sign({ user: { email } }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("🔥 ERROR in signup:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET Route for all users
router.get("/users", async (req, res) => {
  console.log("✅ Fetching all users...");

  try {
    // Query to get all users
    const result = await client.query("SELECT * FROM users");

    // Send back the result in the response
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;