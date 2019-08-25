"use strict";

const http = require("http");
const prometheus = require("prom-client");

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

prometheus.collectDefaultMetrics({
  timeout: 5000,
  prefix: "api_"
});
const metrics = {
  userConnects: new prometheus.Counter({
    name: "api_user_connect_count",
    help: "Count of connections to DB to fetch user information"
  }),
  requestErrors: new prometheus.Counter({
    name: "api_request_error_count",
    help: "Count of requests, which ended with an error"
  }),
  requestDuration: new prometheus.Histogram({
    name: "api_request_duration",
    help: "Duration of request",
    labelNames: ["path", "status_code"]
  })
};

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
  const requestDurationTimer = metrics.requestDuration.startTimer({
    path: req.url
  });
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
      metrics.userConnects.inc();
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
    metrics.requestErrors.inc();
  } finally {
    requestDurationTimer({ status_code: res.statusCode });
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

const metricsServer = http.createServer((req, res) => {
  if (req.url === "/metrics") {
    res.statusCode = 200;
    res.end(prometheus.register.metrics());
  } else {
    res.statusCode = 404;
    res.end("Not Found\n");
  }
});
metricsServer.once("error", e => {
  console.error(e);
  server.close();
  process.exit(1);
});
metricsServer.listen(24231, hostname, () => {
  info("metricsserver:start", { address: `http://${hostname}:24231` });
});
