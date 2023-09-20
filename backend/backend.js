const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user"
});

app.get("/", (req, res) => {
  res.send("Welcome to the registration page!");
});

app.post("/user", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, password];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Registration failed. Please try again later." });
      }
      return res.status(201).json({ message: "Registration successful" });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
