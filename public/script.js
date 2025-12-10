// ================================
// HISTORY (60 samples)
// ================================
const HISTORY_MAX = 60;

const history = {
    temp: [],
    hum: [],
    uv: [],
    gas: [],
    lux: []
};

const GRAPH_MAX = {
    temp: 50,
    hum: 100,
    uv: 12,
    gas: 200,
    lux: 2000
};

const canvases = {
    temp: document.getElementById("chart_temp"),
    hum: document.getElementById("chart_hum"),
    uv: document.getElementById("chart_uv"),
    gas: document.getElementById("chart_gas"),
    lux: document.getElementById("chart_lux")
};

// ================================
// DRAW GRAPH
// ================================
function drawGraph(canvas, list, maxValue) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#0f0";
    ctx.beginPath();

    if (list.length < 2) return;

    for (let i = 0; i < list.length; i++) {
        const x = (i / (HISTORY_MAX - 1)) * w;
        const y = h - (list[i] / maxValue) * h;
        (i === 0) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// ================================
// UPDATE SENSOR FUNCTION
// ================================
function updateSensor(id, value) {
    value = Number(value);
    if (value < 0) value = 0;
    if (value > GRAPH_MAX[id]) value = GRAPH_MAX[id];

    history[id].push(value);
    if (history[id].length > HISTORY_MAX) history[id].shift();

    drawGraph(canvases[id], history[id], GRAPH_MAX[id]);
}

// ================================
// FALLBACK POLLING (every 1 sec)
// ================================
async function pollData() {
    try {
        const res = await fetch("/data");
        const data = await res.json();
        applyData(data);
    } catch (err) {
        console.log("Polling error:", err);
    }
}

setInterval(pollData, 1000);

// ================================
// APPLY INCOMING DATA
// ================================
function applyData(d) {
    updateSensor("temp", d.temp);
    updateSensor("hum", d.hum);
    updateSensor("uv", d.uv);
    updateSensor("gas", d.gas);
    updateSensor("lux", d.lux);
}

// ================================
// WEB SOCKET LIVE UPDATES
// ================================
let ws;

function connectWS() {
    ws = new WebSocket(`wss://${window.location.host}`);

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        if (data.type === "users") {
            document.getElementById("users").textContent =
                "Users online: " + data.count;
        }

        if (data.type === "data") {
            applyData(data.sensorData);
        }
    };

    ws.onclose = () => {
        setTimeout(connectWS, 2000);
    };
}

connectWS();
