const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  host: "host.docker.internal", // connect tới postgres container
  port: 5432,
  user: "postgres",
  password: "123456",
  database: "testdb",
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});