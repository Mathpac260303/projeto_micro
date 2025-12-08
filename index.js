const express = require("express");
const app = express();

// Allow JSON body parsing
app.use(express.json());

// Serve frontend files from public/
app.use(express.static("public"));

// =======================================
// Stored sensor data (latest values)
// =======================================
let sensors = {
    temperature: 0,
    humidity: 0,
    uv: 0,
    gas: 0,
    latitude: 0,
    longitude: 0,
    hour: 0,
    minute: 0
};

// =======================================
// ESP32 -> Server : POST /update
// =======================================
app.post("/update", (req, res) => {
    const data = req.body;

    // Update only if value exists
    if (data.temperature !== undefined) sensors.temperature = Number(data.temperature);
    if (data.humidity !== undefined) sensors.humidity = Number(data.humidity);
    if (data.uv !== undefined) sensors.uv = Number(data.uv);
    if (data.gas !== undefined) sensors.gas = Number(data.gas);

    if (data.latitude !== undefined) sensors.latitude = Number(data.latitude);
    if (data.longitude !== undefined) sensors.longitude = Number(data.longitude);

    if (data.hour !== undefined) sensors.hour = Number(data.hour);
    if (data.minute !== undefined) sensors.minute = Number(data.minute);

    console.log("Updated sensor data:", sensors);

    res.json({ status: "ok" });
});

// =======================================
// FRONTEND -> GET /data
// =======================================
app.get("/data", (req, res) => {
    res.json(sensors);
});

// Root route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port " + port);
});
