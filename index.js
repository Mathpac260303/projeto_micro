const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

app.use(express.json());
app.use(express.static("public"));

// ================================
// CURRENT SENSOR DATA
// ================================
let sensorData = {
  temp: 0,
  hum: 0,
  uv: 0,
  gas: 0,
  lux: 0
};

// ================================
// WEB SOCKET SERVER
// ================================
const wss = new WebSocket.Server({ server: http });
let onlineUsers = 0;

wss.on("connection", (ws) => {
  onlineUsers++;
  broadcastUserCount();

  console.log("Client connected.");

  ws.on("close", () => {
    onlineUsers--;
    broadcastUserCount();
    console.log("Client disconnected.");
  });
});

function broadcastUserCount() {
  const msg = JSON.stringify({
    type: "users",
    count: onlineUsers
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

function broadcastData() {
  const msg = JSON.stringify({
    type: "data",
    sensorData
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

// ================================
// ENDPOINT RECEIVING ESP32 DATA
// ================================
// ESP32 sends: temperature, humidity, uv, gas, lux, ldr
app.post("/update", (req, res) => {
  const body = req.body;

  sensorData.temp = Number(body.temperature);
  sensorData.hum  = Number(body.humidity);
  sensorData.uv   = Number(body.uv);
  sensorData.gas  = Number(body.gas);
  sensorData.lux  = Number(body.lux);

  broadcastData();
  res.send("OK");
});

// ================================
// DASHBOARD FALLBACK POLLING
// ================================
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// ================================
const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log("Server running on port " + PORT));
