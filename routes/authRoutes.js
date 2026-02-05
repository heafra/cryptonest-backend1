const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ======================
// AUTH ROUTES
// ======================

// Signup a new user
router.post("/signup", authController.signup);

// Login route - returns JWT with admin info
router.post("/login", authController.login);

// Logout route - clears cookie or session
router.post("/logout", authController.logout);

module.exports = router;


