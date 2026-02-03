const express = require("express");

const router = express.Router();

const pool = require("../db");

const verifyToken = require("../middleware/verifyToken");



// Optional: check admin flag

const checkAdmin = async (req, res, next) => {

  try {

    const result = await pool.query(

      "SELECT is_admin FROM users WHERE email = $1",

      [req.userEmail]

    );

    if (!result.rows[0]?.is_admin) {

      return res.status(403).json({ error: "Admin only" });

    }

    next();

  } catch (err) {

    return res.status(500).json({ error: "Server error" });

  }

};



// POST /api/admin/set-balance

router.post("/set-balance", verifyToken, checkAdmin, async (req, res) => {

  const { email, balance } = req.body;



  if (!email || typeof balance !== "number")

    return res.status(400).json({ error: "Invalid email or balance" });



  try {

    const result = await pool.query(

      "UPDATE users SET balance = $1 WHERE email = $2 RETURNING email, balance",

      [balance, email]

    );



    if (result.rows.length === 0)

      return res.status(404).json({ error: "User not found" });



    res.json({ message: "Balance updated", user: result.rows[0] });

  } catch (err) {

    console.error("ADMIN SET BALANCE ERROR:", err);

    res.status(500).json({ error: "Server error" });

  }

});



module.exports = router;







