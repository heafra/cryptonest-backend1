const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, balance, invested, is_admin) VALUES ($1, $2, 0, 0, false) RETURNING id, email, balance, invested, is_admin",
      [email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ COOKIE ONLY
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    res.status(400).json({ error: "User already exists" });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email, password, balance, invested, is_admin FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password" });

    // Generate JWT with isAdmin included
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ COOKIE ONLY
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Return token for admin usage
    res.json({
      message: "Login successful",
      token, // <-- needed for admin routes
      user: {
        email: user.email,
        balance: user.balance,
        invested: user.invested,
        isAdmin: user.is_admin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================
// LOGOUT
// ======================
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Logged out" });
};

