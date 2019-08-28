"use strict";

const { readFile } = require("fs").promises;
const http = require("http");
const { resolve: resolvePath } = require("path");

const fetch = require("node-fetch");

const { info, error } = require("./logger");
const { broadcast, handleUpgrade } = require("./wss");

const hostname = "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const staticFiles = `${__dirname}/public`;

function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") {
    return Promise.resolve(undefined);
  }

  return new Promise(resolve => {
    let body = "";
    req.on("data", data => {
      body += data;
    });
    req.on("end", () => {
      resolve(body);
    });
  });
}

const internalServerError = (res, err) => {
  res.statusCode = 500;
  res.end(err.stack);
};

const notFound = res => {
  res.statusCode = 404;
  res.end("Not Found\n");
};

const badRequest = res => {
  res.statusCode = 400;
  res.end("Bad request\n");
};

const ok = res => {
  res.statusCode = 200;
  res.end("OK\n");
};

async function middleware(req, res) {
  if (req.url === "/hook") {
    const body = await readBody(req);
    if (!body) {
      return badRequest(res);
    }

    const alert = JSON.parse(body);
    broadcast(
      JSON.stringify({
        event: "hook",
        data: alert
      })
    );
    info("hook", alert);
    ok(res);
  } else if (req.url === "/trigger") {
    await Promise.all([fetch("http://api/user"), fetch("http://api/user")]);
    ok(res);
  } else if (req.url === "/health") {
    ok(res);
  } else if (!req.url.includes("..")) {
    try {
      const path = req.url === "/" ? "index.html" : req.url;
      const content = await readFile(resolvePath(staticFiles, path), "utf8");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(content);
    } catch (e) {
      if (e.code === "EEXIST") {
        notFound(res);
      } else {
        internalServerError(res, e);
      }
    }
  } else {
    notFound(res);
  }
}

const server = http.createServer(middleware);
server.on("upgrade", (req, socket, head) => {
  if (req.url === "/connect") {
    handleUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});
server.once("error", e => {
  error("server:start", undefined, e);
  server.close();
  process.exit(1);
});
server.listen(port, hostname, () => {
  info("server:start", { address: `http://${hostname}:${port}` });
});
