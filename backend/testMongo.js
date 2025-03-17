require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const testDBQuery = async () => {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected!");

    console.log("🔍 Running test query...");
    const testUsers = await User.find().limit(1);
    console.log("✅ Found users:", testUsers);
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Query Failed:", err);
    process.exit(1);
  }
};

testDBQuery();