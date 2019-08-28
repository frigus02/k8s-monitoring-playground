const WebSocket = require("ws");
const { info } = require("./logger");

const wss = new WebSocket.Server({ noServer: true });
wss.on("connection", ws => {
  info("wss:connection");
  ws.on("message", message => {
    info("wss:message", { message });
  });
});

exports.handleUpgrade = (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit("connection", ws, req);
  });
};

exports.broadcast = message => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
