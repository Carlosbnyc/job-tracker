require("dotenv").config();
const express = require("express");
const { Client } = require('pg');
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL Connection
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Heroku provides this automatically
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates (required for Heroku)
  }
});

// Connect to PostgreSQL once and handle errors properly
client.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL!");
  })
  .catch(err => {
    console.error("❌ Error connecting to PostgreSQL:", err);
    process.exit(1); // Exit if database connection fails
  });

// ✅ Routes
async function startServer() {
  // ✅ Load Auth Routes
  console.log("Attempting to load auth routes...");
  const authRoutes = require("./routes/auth"); // Ensure your routes are correct
  app.use("/api/auth", authRoutes);
  console.log("✅ Auth routes loaded successfully!");

  // ✅ Health Check Route
  app.get("/api/test", (req, res) => {
    res.json({ message: "✅ API is working!" });
  });

  // ✅ Log all registered routes for debugging
  console.log("🔍 Checking all registered routes...");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`✅ Route loaded: ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(`✅ Nested Route loaded: ${handler.route.path}`);
        }
      });
    }
  });

  // Gracefully shut down the server (Optional)
  process.on("SIGINT", async () => {
    console.log("🛑 Closing PostgreSQL connection...");
    await client.end();
    console.log("✅ PostgreSQL connection closed.");
    process.exit(0);
  });

  // ✅ Start the app server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// ✅ Start the app
startServer();