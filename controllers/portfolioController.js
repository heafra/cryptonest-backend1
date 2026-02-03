const pool = require("../db");

exports.getPortfolio = async (req, res) => {
  try {
    if (!req.email) return res.status(401).json({ error: "Unauthorized" });

    const result = await pool.query(
      "SELECT balance FROM users WHERE email = $1",
      [req.email]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({ balance: Number(result.rows[0].balance) || 0 });
  } catch (err) {
    console.error("PORTFOLIO ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};