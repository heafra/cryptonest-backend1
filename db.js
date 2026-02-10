// db.js
import Database from 'better-sqlite3';

// Create/connect to database file
const db = new Database('database.sqlite');

// Create users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0,
    invested REAL DEFAULT 0,
    is_admin INTEGER DEFAULT 0
  )
`).run();

export default db;
