// Store last 5 values for each sensor
let history = {
    s1: [],
    s2: [],
    s3: [],
    s4: [],
    s5: []
};

// Chart.js chart objects
let charts = {};

function createChart(canvasId) {
    return new Chart(document.getElementById(canvasId), {
        type: "line",
        data: {
            labels: ["", "", "", "", ""], // 5 points
            datasets: [{
                label: "Last 5 values",
                data: [0, 0, 0, 0, 0],
                borderColor: "#4db8ff",
                backgroundColor: "rgba(77,184,255,0.2)",
                tension: 0.3
            }]
        },
        options: {
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

// Initialize all charts
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
    // Update number on screen
    document.getElementById(id).textContent = newValue;

    // Add new value to history
    history[id].push(newValue);

    // Keep only the last 5 values
    if (history[id].length > 5) history[id].shift();

    // Update chart
    charts[id].data.datasets[0].data = history[id];
    charts[id].update();
}

setInterval(refresh, 1000);
refresh();
