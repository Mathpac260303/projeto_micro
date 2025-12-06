const express = require("express");
const app = express();

// Serve frontend files from public/
app.use(express.static("public"));

let sensors = {
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0
};

// ESP32 or manual update endpoint
app.get("/update", (req, res) => {
    let { s1, s2, s3, s4, s5 } = req.query;

    if (s1 !== undefined) sensors.s1 = Number(s1);
    if (s2 !== undefined) sensors.s2 = Number(s2);
    if (s3 !== undefined) sensors.s3 = Number(s3);
    if (s4 !== undefined) sensors.s4 = Number(s4);
    if (s5 !== undefined) sensors.s5 = Number(s5);

    console.log("Received update:", sensors);
    res.send("OK");
});

// New JSON endpoint for frontend auto-update
app.get("/data", (req, res) => {
    res.json(sensors);
});

// Send index.html when user visits /
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port " + port);
});
