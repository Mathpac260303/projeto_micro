// Store last 20 values for each sensor (start empty to avoid graph distortion)
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
            labels: [],
            datasets: [{
                data: [],
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
                    max: 120,    // FIX: prevents graph from diving downward
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Initialize charts
charts.s1 = createChart("chart1");
charts.s2 = createChart("chart2");
charts.s3 = createChart("chart3");
charts.s4 = createChart("chart4");
charts.s5 = createChart("chart5");

async function refresh() {
    try {
        const res = await fetch("/data");
        const data = await res.json();

        updateSensor("s1", data.s1);
        updateSensor("s2", data.s2);
        updateSensor("s3", data.s3);
        updateSensor("s4", data.s4);
        updateSensor("s5", data.s5);
        
    } catch (err) {
        console.log("Error fetching data:", err);
    }
}

function updateSensor(id, newValue) {
    // Update displayed number
    document.getElementById(id).textContent = newValue;

    // Add new value to history
    history[id].push(Number(newValue));

    // Keep last 20 values
    if (history[id].length > 20) history[id].shift();

    // Update labels (simple 1..20 index)
    charts[id].data.labels = history[id].map((_, i) => i + 1);

    // Update dataset
    charts[id].data.datasets[0].data = history[id];

    // Refresh chart
    charts[id].update();
}

// Run every 5 seconds
refresh();
setInterval(refresh, 5000);
