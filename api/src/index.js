"use strict";

// FIRST: Initialize tracing

const { NodeTracerProvider } = require("@opentelemetry/node");

const provider = new NodeTracerProvider({
  plugins: {
    grpc: { enabled: false },
    https: { enabled: false },
  },
});

const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { B3Propagator } = require("@opentelemetry/core");

if (process.env.OTEL_COLLECTOR_ENDPOINT) {
  const { CollectorExporter } = require("@opentelemetry/exporter-collector");
  const exporter = new CollectorExporter({
    serviceName: "api",
    url: process.env.OTEL_COLLECTOR_ENDPOINT,
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
} else {
  const { ConsoleSpanExporter } = require("@opentelemetry/tracing");
  const exporter = new ConsoleSpanExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
}

provider.register({
  propagator: new B3Propagator(),
});

// SECOND: Initialize metrics

const { ValueType } = require("@opentelemetry/api");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { MeterProvider } = require("@opentelemetry/metrics");

const metricsExporter = new PrometheusExporter({
  port: 9464,
  startServer: true,
  endpoint: "/metrics",
});
const meter = new MeterProvider({ exporter: metricsExporter }).getMeter("api");

// THEN: Application code

const http = require("http");
const opentelemetry = require("@opentelemetry/api");

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const tracer = opentelemetry.trace.getTracer("api");
const metrics = {
  userConnects: meter.createCounter("api_user_connect_count", {
    description: "Count of connections to DB to fetch user information",
    valueType: ValueType.INT,
  }),
  requestErrors: meter.createCounter("api_request_error_count", {
    description: "Count of requests, which ended with an error",
    valueType: ValueType.INT,
  }),
  requestDuration: meter.createValueRecorder("api_request_duration", {
    description: "Duration of request",
  }),
};

function flattenObject(obj) {
  if (obj == null) return obj;
  return Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return Object.entries(
          flattenObject(value)
        ).map(([childKey, childValue]) => [`${key}.${childKey}`, childValue]);
      } else {
        return [[key, value]];
      }
    })
  );
}

function log(severity, event, data) {
  const span = tracer.getCurrentSpan();
  span.addEvent(event, {
    severity,
    ...flattenObject(data),
  });
}

function info(event, data) {
  log("INFO", event, data);
}

function error(event, data, error) {
  log("ERROR", event, {
    ...data,
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
}

function delay(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

async function middleware(req, res) {
  const requestStart = process.hrtime.bigint();
  const getDuration = () =>
    Number((process.hrtime.bigint() - requestStart) / BigInt(1e6));

  try {
    if (req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(`
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
      res.write("Found /");
    } else if (req.url === "/user") {
      const span = tracer.startSpan("user");
      try {
        await tracer.withSpan(span, async () => {
          info("user:connect");
          metrics.userConnects.add(1);
          await delay(20 + Math.floor(Math.random() * 1000));
          if (Math.random() > 0.5) {
            throw new Error("meh");
          }

          res.statusCode = 200;
          res.write("Hello user :-)\n");
        });
      } catch (err) {
        span.setStatus({
          code: opentelemetry.CanonicalCode.UNKNOWN,
          message: err.message,
        });
        throw err;
      } finally {
        span.end();
      }
    } else if (req.url === "/health") {
      res.statusCode = 200;
      res.write("Healthy");
    } else {
      res.statusCode = 404;
      res.write("Not Found\n");
    }

    info("request");
  } catch (e) {
    res.statusCode = 500;
    res.write("Internal server error");

    error("request", {}, e);
    metrics.requestErrors.add(1);
  } finally {
    res.end();
    metrics.requestDuration.record(getDuration(), {
      path: req.url,
      status_code: res.statusCode,
    });
  }
}

const server = http.createServer(middleware);
server.once("error", (e) => {
  console.error(e);
  server.close();
  process.exit(1);
});
server.listen(port, hostname, () => {
  console.log(`Server listening at http://${hostname}:${port}`);
});
