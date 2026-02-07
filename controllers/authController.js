// controllers/authController.js
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, balance, invested, is_admin)
       VALUES ($1, $2, 0, 0, false)
       RETURNING id, email, balance, invested, is_admin`,
      [email, hashed]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true on HTTPS
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        email: user.email,
        balance: user.balance,
        invested: user.invested,
        isAdmin: user.is_admin,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        balance: user.balance,
        invested: user.invested,
        isAdmin: user.is_admin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ======================
// LOGOUT
// ======================
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Logged out" });
};

