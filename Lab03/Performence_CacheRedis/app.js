// app.js
const express = require("express");
const redis = require("redis");

const app = express();
const client = redis.createClient();

client.connect();

// Fake DB (2s delay)
function getUserFromDB(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: "User " + id });
    }, 2000);
  });
}

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  // 1. Check cache
  const cachedUser = await client.get(id);
  if (cachedUser) {
    return res.json({
      source: "cache",
      data: JSON.parse(cachedUser)
    });
  }

  // 2. Query DB
  const user = await getUserFromDB(id);

  // 3. Save to cache (TTL 10s)
  await client.setEx(id, 10, JSON.stringify(user));

  res.json({
    source: "database",
    data: user
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
