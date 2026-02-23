const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ❌ Hardcoded secret (intentional vulnerability)
const SECRET_KEY = "mysecret123";

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, email TEXT, note TEXT)"
  );
});

// ❌ SQL Injection vulnerable
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  db.run(
    "INSERT INTO users (email, password) VALUES ('" +
      email +
      "','" +
      password +
      "')"
  );

  res.json({ message: "User registered" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = '" +
      email +
      "' AND password = '" +
      password +
      "'",
    (err, row) => {
      if (row) {
        res.json(row);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  );
});

// ❌ No authentication check
app.post("/add-note", (req, res) => {
  const { email, note } = req.body;

  db.run(
    "INSERT INTO notes (email, note) VALUES ('" +
      email +
      "','" +
      note +
      "')"
  );

  res.json({ message: "Note added" });
});

app.get("/notes", (req, res) => {
  const email = req.query.email;

  db.all(
    "SELECT * FROM notes WHERE email = '" + email + "'",
    (err, rows) => {
      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
