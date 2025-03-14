%%writefile script.js
const API_URL = "http://127.0.0.1:5001";  // Change to deployed API URL later

async function predict() {
    const featuresInput = document.getElementById("features").value;
    const features = featuresInput.split(",").map(Number);

    if (features.some(isNaN)) {
        alert("Please enter valid numbers separated by commas.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "4620e3f7eee6dd16b11907669672adac"
            },
            body: JSON.stringify({ features })
        });

        const data = await response.json();
        document.getElementById("result").innerText = `Prediction: ${data.prediction} Watts`;

        updateChart(data.prediction);
        updateDeviceStatus(data.prediction);
    } catch (error) {
        document.getElementById("result").innerText = "Error fetching prediction!";
    }
}

// Chart.js - Update Solar Energy Graph
function updateChart(prediction) {
    const ctx = document.getElementById("energyChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Past", "Now", "Future"],
            datasets: [{
                label: "Solar Energy Prediction (W)",
                data: [30000, 40000, prediction],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2
            }]
        }
    });
}

// Update Battery & Inverter Status
function updateDeviceStatus(prediction) {
    document.getElementById("battery-status").innerText = prediction > 50000 ? "Full" : "Charging";
    document.getElementById("inverter-status").innerText = prediction > 30000 ? "Active" : "Idle";
}
