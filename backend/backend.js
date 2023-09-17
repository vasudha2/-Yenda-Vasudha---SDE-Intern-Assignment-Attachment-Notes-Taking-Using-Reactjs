const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user"
});

app.post('/user', (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
  const values = [name, email, password];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Registration failed" });
    }
    return res.status(201).json({ message: "Registration successful" });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  const values = [email, password];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred while processing your request." });
    }

    if (results.length === 1) {
    
      return res.status(200).json({ message: "Login successful" });
    } else {
      
      return res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
