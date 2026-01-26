// server.js
const http = require("http");

const PORT = process.argv[2] || 3001;
const NAME = process.argv[3] || "Server";

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Response from ${NAME} on port ${PORT}\n`);
}).listen(PORT, () => {
  console.log(`${NAME} running on port ${PORT}`);
});
