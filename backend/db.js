const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL!"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

module.exports = { client };