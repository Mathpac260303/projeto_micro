const express = require("express");
const app = express();

app.use(express.json());  // allow JSON POST bodies

// Object to store ESP data
let sensorData = {
  s1: null,
  s2: null,
  s3: null,
  s4: null,
  s5: null,
  timestamp: null
};

// Homepage shows last received data
app.get("/", (req, res) => {
  res.send(`
    🚀 SIM800L Cloud Server Running! <br><br>
    <b>Last sensor update:</b><br>
    s1: ${sensorData.s1}<br>
    s2: ${sensorData.s2}<br>
    s3: ${sensorData.s3}<br>
    s4: ${sensorData.s4}<br>
    s5: ${sensorData.s5}<br>
    time: ${sensorData.timestamp}
  `);
});

// ESP sends POST with JSON
app.post("/update", (req, res) => {
  const { s1, s2, s3, s4, s5 } = req.body;

  // Validate presence
  if (s1 === undefined || s2 === undefined || s3 === undefined || s4 === undefined || s5 === undefined) {
    return res.status(400).send("ERROR: missing one or more sensor fields (s1–s5)");
  }

  // Save values
  sensorData = {
    s1,
    s2,
    s3,
    s4,
    s5,
    timestamp: new Date().toISOString()
  };

  console.log("ESP sent:", sensorData);

  res.send("Sensor data updated successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
