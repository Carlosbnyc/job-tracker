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
  
      await client.query(
        "UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = $1",
        [email]
      );
  
      res.json({ message: "Email verified successfully!" });
    } catch (err) {
      console.error("🔥 ERROR in verification:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });