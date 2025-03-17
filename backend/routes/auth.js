const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const nodemailer = require("nodemailer");

const router = express.Router();

// ✅ Setup PostgreSQL Client
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Heroku provides this automatically
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL in auth route!"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

const JWT_SECRET = process.env.JWT_SECRET || "BenjiNYCy"; // Replace this with a strong secret
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email (set in .env)
    pass: process.env.EMAIL_PASS  // Your email password (set in .env)
  }
});

// ✅ Middleware to Verify JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ Signup Route (with Email Verification)
router.post("/signup", async (req, res) => {
  console.log("✅ Signup route triggered!");
  const { email, password } = req.body;

  try {
    const userExists = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code

    await client.query(
      "INSERT INTO users (email, password, verification_code, is_verified) VALUES ($1, $2, $3, FALSE)",
      [email, hashedPassword, verificationCode]
    );

    // Send Verification Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Job Tracker Account",
      text: `Your verification code is: ${verificationCode}`
    });

    res.json({ message: "Verification code sent to email!" });
  } catch (err) {
    console.error("🔥 ERROR in signup:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Email Verification Route
router.post("/verify", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.rows[0].verification_code !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Mark user as verified
    await client.query("UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = $1", [email]);

    res.json({ message: "✅ Email verified successfully!" });
  } catch (err) {
    console.error("🔥 ERROR in verification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login Route (User must be verified first)
router.post("/login", async (req, res) => {
  console.log("✅ Login route triggered!");
  const { email, password } = req.body;

  try {
    const user = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.rows[0].is_verified) {
      return res.status(403).json({ error: "Email not verified. Please check your inbox." });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ user: { id: user.rows[0].id, email } }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("🔥 ERROR in login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all users (Protected Route)
router.get("/users", authenticateToken, async (req, res) => {
  console.log("✅ Fetching all users...");

  try {
    const result = await client.query("SELECT id, email, is_verified FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get logged-in user's profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await client.query("SELECT id, email, is_verified FROM users WHERE id = $1", [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error("🔥 Error fetching user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;