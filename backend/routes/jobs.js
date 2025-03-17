const express = require("express");
const router = express.Router();
const { client } = require("../db"); // Import client from db.js

// ✅ Get all job applications
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Add a new job application
router.post("/", async (req, res) => {
  const { user_id, company_name, job_title, status } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO jobs (user_id, company_name, job_title, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, company_name, job_title, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete a job application
router.delete("/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    const result = await client.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [jobId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully!" });
  } catch (error) {
    console.error("🔥 Error deleting job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;