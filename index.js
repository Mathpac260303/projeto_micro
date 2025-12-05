const express = require("express");
const app = express();

let sensors = {
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0
};

// Endpoint ESP32 uses to update values
app.get("/update", (req, res) => {
    let { s1, s2, s3, s4, s5 } = req.query;

    if (s1) sensors.s1 = Number(s1);
    if (s2) sensors.s2 = Number(s2);
    if (s3) sensors.s3 = Number(s3);
    if (s4) sensors.s4 = Number(s4);
    if (s5) sensors.s5 = Number(s5);

    console.log("Received update:", sensors);

    res.send("OK");
});

// Endpoint to show current values in browser
app.get("/", (req, res) => {
    res.send(`
        <h2>Sensor Values</h2>
        <p>s1 = ${sensors.s1}</p>
        <p>s2 = ${sensors.s2}</p>
        <p>s3 = ${sensors.s3}</p>
        <p>s4 = ${sensors.s4}</p>
        <p>s5 = ${sensors.s5}</p>
    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port " + port);
});
