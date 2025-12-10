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
  const msg = JSON.stringify({ type: "users", count: onlineUsers });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

function broadcastData() {
  const msg = JSON.stringify({ type: "data", sensorData });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

// ================================
// ENDPOINT RECEIVING ESP32 DATA
// ================================
app.post("/update", (req, res) => {
  const { temp, hum, uv, gas, lux } = req.body;

  sensorData.temp = Number(temp);
  sensorData.hum = Number(hum);
  sensorData.uv = Number(uv);
  sensorData.gas = Number(gas);
  sensorData.lux = Number(lux);

  broadcastData();

  res.send("OK");
});

// ================================
// ENDPOINT FOR DASHBOARD FETCH (fallback)
// ================================
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// ================================
const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log("Server running on port " + PORT));
