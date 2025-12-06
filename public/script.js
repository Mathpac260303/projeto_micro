// History for each sensor (start empty)
let history = {
    s1: [],
    s2: [],
    s3: [],
    s4: [],
    s5: []
};

let charts = {};

function createChart(canvasId) {
    return new Chart(document.getElementById(canvasId), {
        type: "line",
        data: {
            labels: Array(10).fill(""),
            datasets: [{
                data: Array(10).fill(0),
                borderColor: "#4db8ff",
                backgroundColor: "rgba(77,184,255,0.2)",
                tension: 0.3
            }]
        },
        options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 120,   // LOCKED — prevents infinite scaling
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

charts.s1 = createChart("chart1");
charts.s2 = createChart("chart2");
charts.s3 = createChart("chart3");
charts.s4 = createChart("chart4");
charts.s5 = createChart("chart5");

async function refresh() {
    const res = await fetch("/data");
    const data = await res.json();

    updateSensor("s1", Number(data.s1));
    updateSensor("s2", Number(data.s2));
    updateSensor("s3", Number(data.s3));
    updateSensor("s4", Number(data.s4));
    updateSensor("s5", Number(data.s5));
}

function updateSensor(id, newValue) {
    document.getElementById(id).textContent = newValue;

    // First-time initialization: fill history with the first value
    if (history[id].length === 0) {
        history[id] = Array(10).fill(newValue);
        charts[id].data.datasets[0].data = history[id];
        charts[id].update();
        return;
    }

    // Add new value
    history[id].push(newValue);

    // Keep only 10 values
    if (history[id].length > 10) history[id].shift();

    // Update chart
    charts[id].data.datasets[0].data = history[id];
    charts[id].update();
}

// Update every 5 seconds
refresh();
setInterval(refresh, 5000);
