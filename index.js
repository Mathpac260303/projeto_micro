const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");

// Allow JSON body parsing
app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// ==============================
// Stored latest sensor data
// ==============================
let sensors = {
    temperature: 0,
    humidity: 0,
    uv: 0,
    gas: 0,   // CO ppm
    lux: 0
};

// ==============================
// ESP32 -> POST /update
// ==============================
app.post("/update", (req, res) => {
    const d = req.body;

    if (d.temperature !== undefined) sensors.temperature = Number(d.temperature);
    if (d.humidity !== undefined) sensors.humidity = Number(d.humidity);
    if (d.uv !== undefined) sensors.uv = Number(d.uv);
    if (d.gas !== undefined) sensors.gas = Number(d.gas);
    if (d.lux !== undefined) sensors.lux = Number(d.lux);

    console.log("Updated:", sensors);
    res.json({ status: "ok" });
});

// ==============================
// FRONTEND -> GET /data
// ==============================
app.get("/data", (req, res) => {
    res.json(sensors);
});

// ==============================
// WebSocket: Track connected users
// ==============================
const wss = new WebSocket.Server({ server: http });

function broadcastUserCount() {
    const count = wss.clients.size;
    const msg = JSON.stringify({ users: count });

    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg);
        }
    });
}

wss.on("connection", ws => {
    broadcastUserCount();
    ws.on("close", broadcastUserCount);
});

// ==============================
// Start server
// ==============================
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("Server running on port " + port);
});
