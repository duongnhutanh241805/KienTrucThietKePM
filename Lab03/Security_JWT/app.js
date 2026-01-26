// app.js
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET_KEY = "my_secret_key";

// Fake user
const user = {
  id: 1,
  username: "admin",
  password: "123456"
};

// Login → generate JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1m" }
  );

  res.json({ token });
});

// Middleware verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

// Protected API
app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

