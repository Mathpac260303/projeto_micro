<script>
// ================================
// CONFIGURATION
// ================================
// Define a MAX VALUE for each sensor
const GRAPH_MAX = {
    s1: 100,
    s2: 200,
    s3: 500,
    s4: 1000,
    s5: 50
};

let GRAPH_TICKS = 5;   // Y-axis labels count

// History for each sensor: last 10 values
const history = {
    s1: [],
    s2: [],
    s3: [],
    s4: [],
    s5: []
};

// Canvas references for each sensor
const canvases = {
    s1: document.getElementById("chart1"),
    s2: document.getElementById("chart2"),
    s3: document.getElementById("chart3"),
    s4: document.getElementById("chart4"),
    s5: document.getElementById("chart5")
};

// ================================
// FETCH + UPDATE
// ================================
async function refresh() {
    try {
        const res = await fetch("/data");
        const data = await res.json();

        updateSensor("s1", Number(data.s1));
        updateSensor("s2", Number(data.s2));
        updateSensor("s3", Number(data.s3));
        updateSensor("s4", Number(data.s4));
        updateSensor("s5", Number(data.s5));

    } catch (err) {
        console.log("Error fetching data:", err);
    }
}

function updateSensor(id, value) {

    // Update display
    document.getElementById(id).textContent = value;

    // Clamp according to each sensor's max
    const max = GRAPH_MAX[id];
    if (value < 0) value = 0;
    if (value > max) value = max;

    // Store history (max 10 values)
    history[id].push(value);
    if (history[id].length > 10) history[id].shift();

    // Draw each graph with its custom max
    drawGraph(canvases[id], history[id], max);
}

// ================================
// DRAW GRAPH (with custom max)
// ================================
function drawGraph(canvas, values, maxValue) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight || 120;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (values.length === 0) return;

    const marginLeft = 30; 
    const marginBottom = 5;

    // ================================
    // Y-AXIS LABELS + GRID
    // ================================
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

    // ================================
    // LINE GRAPH
    // ================================
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
// INITIAL + INTERVAL
// ================================
refresh();
setInterval(refresh, 5000);
</script>
