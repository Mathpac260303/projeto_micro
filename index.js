const express = require('express');
const app = express();

app.use(express.text());
app.use(express.json());

// Stores last command sent by you (from your phone)
let lastCommand = "NONE";

// Stores last data sent by the SIM800L device
let lastData = {};

// Stores the latest readings of 5 sensors from the ESP
let sensorData = {
  s1: null,
  s2: null,
  s3: null,
  s4: null,
  s5: null,
  updatedAt: null  // timestamp of last update
};

// Base route (for testing)
app.get('/', (req, res) => {
  res.send("🚀 SIM800L Cloud Server Running!");
});

// SIM800L GETs this to receive a command
app.get('/cmd', (req, res) => {
  res.send(lastCommand);
});

// You POST a command here (from website or phone)
app.post('/cmd', (req, res) => {
  lastCommand = req.body;
  res.send("COMMAND RECEIVED: " + req.body);
});

// SIM800L POSTs telemetry/status here
app.post('/log', (req, res) => {
  lastData = req.body;
  res.send("LOG RECEIVED");
});

// You GET this on your phone to see SIM800L status
app.get('/status', (req, res) => {
  res.json(lastData);
});

// =========================
//   SENSOR MEMORY OBJECT
// =========================

// ESP32 sends the latest readings of 5 sensors here (every ~10s)
app.post('/sensors', (req, res) => {
  const { s1, s2, s3, s4, s5 } = req.body;

  // Basic validation: all 5 fields must exist
  if (
    s1 === undefined ||
    s2 === undefined ||
    s3 === undefined ||
    s4 === undefined ||
    s5 === undefined
  ) {
    return res.status(400).send("Missing one or more sensor fields (s1..s5).");
  }

  sensorData = {
    s1,
    s2,
    s3,
    s4,
    s5,
    updatedAt: new Date().toISOString()
  };

  res.send("SENSOR DATA UPDATED");
});

// Anyone can GET the last sensor readings stored in memory
app.get('/sensors', (req, res) => {
  res.json(sensorData);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
