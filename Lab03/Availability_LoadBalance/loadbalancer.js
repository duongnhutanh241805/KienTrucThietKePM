// loadbalancer.js
const http = require("http");

const servers = [
  { host: "localhost", port: 3001 },
  { host: "localhost", port: 3002 }
];

let current = 0;

http.createServer((req, res) => {
  const server = servers[current];
  current = (current + 1) % servers.length; // round-robin

  const proxy = http.request(
    {
      host: server.host,
      port: server.port,
      path: req.url,
      method: req.method
    },
    proxyRes => {
      proxyRes.pipe(res);
    }
  );

  proxy.on("error", () => {
    res.writeHead(502);
    res.end("Server unavailable\n");
  });

  req.pipe(proxy);
}).listen(3000, () => {
  console.log("Load Balancer running on port 3000");
});
