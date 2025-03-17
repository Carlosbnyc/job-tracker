require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection Function
let isConnected = false; // Track connection state

// ✅ MongoDB Connection Function

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected.");
      return;
    }

    console.log("🔍 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "jobtracker",
      serverSelectionTimeoutMS: 10000, // Fail fast if MongoDB isn't reachable
      socketTimeoutMS: 45000, // Keep socket connection stable
      bufferCommands: true, // Enable buffering to prevent timeout errors
      autoIndex: false, // Disable auto-indexing for performance
    });

    console.log("✅ MongoDB Connected successfully!");

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};


// ✅ Start the Server
async function startServer() {
  await connectDB(); // Ensure MongoDB is connected before starting Express

  console.log("🚀 Starting Express server...");

  // ✅ Load Routes
  console.log("Attempting to load auth routes...");
  const authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes);
  console.log("✅ Auth routes loaded successfully!");

  // ✅ Health Check Route
  app.get("/api/test", (req, res) => {
    res.json({ message: "✅ API is working!" });
  });

  // ✅ Log all registered routes
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
  // Gracefully close MongoDB connection when stopping the server
process.on("SIGINT", async () => {
  console.log("🛑 Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Start the app
startServer();

connectDB();
module.exports = connectDB;