const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const pool = require("../db");



// ✅ PROTECTED

router.get("/", auth, async (req, res) => {

  try {

    const result = await pool.query(

      "SELECT balance, invested FROM users WHERE id = $1",

      [req.user.userId]

    );



    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({ error: "Server error" });

  }

});



module.exports = router;