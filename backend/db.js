const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "articles.db"),
  (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database");
  }
);

db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    url TEXT,
    content TEXT,
    isUpdated INTEGER DEFAULT 0,
    createdAt TEXT
  )
`);

module.exports = db;
