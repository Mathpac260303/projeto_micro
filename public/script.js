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
    // Update numeric display
    document.getElementById(id).textContent = value;

    // Clamp value between 0 and 100 (adjust if your range is different)
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    // Update history
    history[id].push(value);
    if (history[id].length > 10) history[id].shift();

    // Redraw the graph for this sensor
    drawGraph(canvases[id], history[id]);
}

function drawGraph(id, canvas, values) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight || 120;

    // Ensure canvas internal resolution matches CSS
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (values.length === 0) return;

    // Get this sensor's max Y-value
    const maxValue = maxY[id] || 100;

    ctx.strokeStyle = "#4db8ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const n = values.length;
    const stepX = n > 1 ? width / (n - 1) : width;

    for (let i = 0; i < n; i++) {
        const v = values[i];

        // scale v to canvas height according to maxValue
        const y = height - (v / maxValue) * height;
        const x = stepX * i;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();
}

// Initial run + periodic
refresh();
setInterval(refresh, 5000);
