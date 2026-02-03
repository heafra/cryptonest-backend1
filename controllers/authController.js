const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// Signup
// ======================
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    const result = await pool.query(
      "INSERT INTO users (email, password, balance, invested) VALUES ($1, $2, 0, 0) RETURNING id, email, balance, invested",
      [email, hashedPassword]
    );

    const user = result.rows[0];

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔹 true in production with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return JSON with token and user info
    res.json({
      message: "Signup successful",
      token, // for frontend localStorage
      user: {
        email: user.email,
        balance: user.balance,
        invested: user.invested,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "User already exists or server error" });
  }
};

// ======================
// Login
// ======================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user
    const result = await pool.query(
      "SELECT id, email, password, balance, invested FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password" });

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔹 true in production with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return JSON with token and user info
    res.json({
      message: "Login successful",
      token, // for frontend localStorage
      user: {
        email: user.email,
        balance: user.balance,
        invested: user.invested,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================
// Logout
// ======================
exports.logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out" });
};

