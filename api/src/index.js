"use strict";

const http = require("http");

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

function middleware(req, res) {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Test Server</title>
      </head>
      <body>
        <h1>Test Server</h1>
      </body>
      </html>
    `);
  } else if (req.url === "/redirect") {
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end("Found /");
  } else if (req.url === "/user") {
    res.statusCode = 500;
    res.end("Internal server error");
  } else if (req.url === "/health") {
    res.statusCode = 200;
    res.end("Healthy");
  } else {
    res.statusCode = 404;
    res.end("Not Found\n");
  }
}

const server = http.createServer(middleware);
server.once("error", e => {
  console.error(e);
  server.close();
  process.exit(1);
});
server.listen(port, hostname, () => {
  console.log(`Running on http://${hostname}:${port}`);
});
