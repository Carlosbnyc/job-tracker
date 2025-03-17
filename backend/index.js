require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { client } = require("./db"); // Import the shared PostgreSQL client

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Load Routes
console.log("Attempting to load routes...");
const authRoutes = require("./routes/auth"); 
const jobRoutes = require("./routes/jobs");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

console.log("✅ Routes loaded successfully!");

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

// ✅ Gracefully shut down the server
process.on("SIGINT", async () => {
  console.log("🛑 Closing PostgreSQL connection...");
  await client.end();
  console.log("✅ PostgreSQL connection closed.");
  process.exit(0);
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));