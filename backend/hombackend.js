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
  database: "note"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.message);
  } else {
    console.log("Connected to the database");
  }
});

app.get('/note', (req, res) => {
  const sql = "SELECT * FROM note";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.message);
      return res.status(500).json({ error: "An error occurred while processing your request." });
    }

    return res.status(200).json(results);
  });
});

app.post('/note', (req, res) => {
  const { title, description, videoLink, imageLink, backgroundColor } = req.body;
  const sql = "INSERT INTO note (title, description, videoLink, imageLink, backgroundColor) VALUES (?, ?, ?, ?, ?)";
  const values = [title, description, videoLink, imageLink, backgroundColor];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Note creation failed" });
    }
    return res.status(201).json({ message: "Note created successfully" });
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
