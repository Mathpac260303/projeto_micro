const express = require('express');
const app = express();

app.use(express.text());
app.use(express.json());

// Stores last command sent by you (from your phone)
let lastCommand = "NONE";

// Stores last data sent by the SIM800L device
let lastData = {};

// Memory counter variable
let counter = 0;

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
//       COUNTER API
// =========================

// Update counter (POST)
// Body must contain only a number
app.post('/counter', (req, res) => {
  const value = Number(req.body);

  if (isNaN(value)) {
    return res.status(400).send("Invalid value — must be a number.");
  }

  counter = value;
  res.send(`Counter updated to ${counter}`);
});

// Read counter (GET)
app.get('/counter', (req, res) => {
  res.json({ counter });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
