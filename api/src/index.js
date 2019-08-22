"use strict";

const http = require("http");

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

function log(severity, event, data) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      severity,
      event,
      data
    })
  );
}

function info(event, data) {
  log("INFO", event, data);
}

function error(event, data, error) {
  log("ERROR", event, {
    ...data,
    error: {
      message: error.message,
      stack: error.stack
    }
  });
}

function delay(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

async function middleware(req, res) {
  const requestStart = process.hrtime.bigint();
  const gatherData = () => ({
    request: {
      url: req.url,
      headers: req.headers
    },
    response: {
      statusCode: res.statusCode
    },
    duration: Number((process.hrtime.bigint() - requestStart) / BigInt(1e6))
  });

  try {
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
      info("user:connect");
      await delay(20 + Math.floor(Math.random() * 1000));
      throw new Error("meh");
    } else if (req.url === "/health") {
      res.statusCode = 200;
      res.end("Healthy");
    } else {
      res.statusCode = 404;
      res.end("Not Found\n");
    }

    info("request", gatherData());
  } catch (e) {
    res.statusCode = 500;
    res.end("Internal server error");

    error("request", gatherData(), e);
  }
}

const server = http.createServer(middleware);
server.once("error", e => {
  console.error(e);
  server.close();
  process.exit(1);
});
server.listen(port, hostname, () => {
  info("server:start", { address: `http://${hostname}:${port}` });
});
