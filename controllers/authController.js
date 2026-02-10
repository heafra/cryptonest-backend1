import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,      // MUST be true for Vercel HTTPS
  sameSite: "none",  // REQUIRED for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    if (await User.findOne({ email }))
      return res.status(400).json({ error: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({ user: { email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({ user: { email: user.email } });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    res.json({ user });
  } catch {
    res.status(401).json({ user: null });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
};


