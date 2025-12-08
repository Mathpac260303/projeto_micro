// ================================
// GRAPH CONFIG
// ================================
const GRAPH_MAX = {
    temp: 50,     // °C max
    hum: 100,     // %
    uv: 12,       // UV Index range
    gas: 10       // 0–10 scale
};

let GRAPH_TICKS = 5;

// ================================
// History storage (last 10 values)
// ================================
const history = {
    temp: [],
    hum: [],
    uv: [],
    gas: []
};

// Canvas references
const canvases = {
    temp: document.getElementById("chart_temp"),
    hum: document.getElementById("chart_hum"),
    uv: document.getElementById("chart_uv"),
    gas: document.getElementById("chart_gas")
};

// ================================
// Fetch data from server
// ================================
async function refresh() {
    try {
        const res = await fetch("/data");
        const data = await res.json();

        // Update numerical values
        updateSensor("temp", Number(data.temperature));
        updateSensor("hum", Number(data.humidity));
        updateSensor("uv", Number(data.uv));
        updateSensor("gas", Number(data.gas));

        // Update GPS text fields
        document.getElementById("lat").textContent = data.latitude.toFixed(6);
        document.getElementById("lng").textContent = data.longitude.toFixed(6);

        // Format time HH:MM
        let hh = String(data.hour).padStart(2, "0");
        let mm = String(data.minute).padStart(2, "0");
        document.getElementById("time").textContent = `${hh}:${mm}`;

    } catch (err) {
        console.log("Error fetching data:", err);
    }
}

// ================================
// Update one sensor
// ================================
function updateSensor(id, value) {
    document.getElementById(id).textContent = value;

    const max = GRAPH_MAX[id];
    if (value < 0) value = 0;
    if (value > max) value = max;

    history[id].push(value);
    if (history[id].length > 10) history[id].shift();

    drawGraph(canvases[id], history[id], max);
}

// ================================
// Draw line graph
// ================================
function drawGraph(canvas, values, maxValue) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth || canvas.width;
    const height = canvas.clientHeight || canvas.height;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (values.length === 0) return;

    const marginLeft = 30;
    const marginBottom = 5;

    ctx.fillStyle = "#ccc";
    ctx.font = "10px Arial";
    ctx.textAlign = "right";

    for (let i = 0; i <= GRAPH_TICKS; i++) {
        const val = (maxValue / GRAPH_TICKS) * i;
        const y = height - (i / GRAPH_TICKS) * (height - marginBottom);

        ctx.fillText(val.toFixed(0), marginLeft - 5, y + 3);

        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(marginLeft, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#4db8ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const n = values.length;
    const stepX = n > 1 ? (width - marginLeft) / (n - 1) : width;

    for (let i = 0; i < n; i++) {
        const v = values[i];
        const y = height - marginBottom - (v / maxValue) * (height - marginBottom);
        const x = marginLeft + stepX * i;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// ================================
// Start periodic updates
// ================================
refresh();
setInterval(refresh, 5000);
