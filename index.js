const express = require("express");
const app = express();

let sensors = {
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0
};

// Endpoint ESP32 or manual updates use
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

// NEW: Endpoint for browser auto-refresh
app.get("/data", (req, res) => {
    res.json(sensors);
});

// Updated homepage with auto-updating values
app.get("/", (req, res) => {
    res.send(`
        <h2>Sensor Values (Auto Updating)</h2>

        <p>s1 = <span id="s1">${sensors.s1}</span></p>
        <p>s2 = <span id="s2">${sensors.s2}</span></p>
        <p>s3 = <span id="s3">${sensors.s3}</span></p>
        <p>s4 = <span id="s4">${sensors.s4}</span></p>
        <p>s5 = <span id="s5">${sensors.s5}</span></p>

        <script>
            async function refresh() {
                try {
                    let res = await fetch('/data');
                    let data = await res.json();

                    document.getElementById("s1").textContent = data.s1;
                    document.getElementById("s2").textContent = data.s2;
                    document.getElementById("s3").textContent = data.s3;
                    document.getElementById("s4").textContent = data.s4;
                    document.getElementById("s5").textContent = data.s5;
                } catch (err) {
                    console.log("Error updating:", err);
                }
            }

            setInterval(refresh, 1000); // update every 1 second
        </script>
    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port " + port);
});
