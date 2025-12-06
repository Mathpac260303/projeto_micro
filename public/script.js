// Store last 20 values for each sensor
let history = {
    s1: Array(20).fill(0),
    s2: Array(20).fill(0),
    s3: Array(20).fill(0),
    s4: Array(20).fill(0),
    s5: Array(20).fill(0)
};

let charts = {};

function createChart(canvasId) {
    return new Chart(document.getElementById(canvasId), {
        type: "line",
        data: {
            labels: Array(20).fill(""),
            datasets: [{
                data: Array(20).fill(0),
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
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Init all charts
charts.s1 = createChart("chart1");
charts.s2 = createChart("chart2");
charts.s3 = createChart("chart3");
charts.s4 = createChart("chart4");
charts.s5 = createChart("chart5");

async function refresh() {
    const res = await fetch("/data");
    const data = await res.json();

    updateSensor("s1", data.s1);
    updateSensor("s2", data.s2);
    updateSensor("s3", data.s3);
    updateSensor("s4", data.s4);
    updateSensor("s5", data.s5);
}

function updateSensor(id, newValue) {
    document.getElementById(id).textContent = newValue;

    history[id].push(Number(newValue));
    if (history[id].length > 20) history[id].shift();

    charts[id].data.datasets[0].data = history[id];
    charts[id].update();
}

// Update every 5 seconds
refresh();
setInterval(refresh, 5000);
