// createTestUser.js
const pool = require("./db"); // adjust path if needed
const bcrypt = require("bcrypt");

(async () => {
  try {
    const email = "admin@test.com"; // test user email
    const password = "Test123!";    // test password

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user if not exists
    await pool.query(
      `INSERT INTO users (email, password, balance, invested, is_admin)
       VALUES ($1, $2, 0, 0, true)
       ON CONFLICT (email) DO NOTHING`,
      [email, hashedPassword]
    );

    console.log("✅ Test user created: admin@test.com / Test123!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create test user:", err);
    process.exit(1);
  }
})();