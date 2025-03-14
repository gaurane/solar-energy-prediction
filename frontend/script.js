// ✅ Replace with your deployed backend URL from Render
const API_URL = "https://your-app-name.onrender.com";  // Change this to actual API URL

// ✅ Securely Fetch API Key from Environment (if using Vercel)
const API_KEY = import.meta.env.VITE_API_KEY || "4620e3f7eee6dd16b11907669672adac"; 

async function predict() {
    const featuresInput = document.getElementById("features").value.trim();
    const features = featuresInput.split(",").map(Number);

    if (!featuresInput || features.some(isNaN)) {
        alert("❌ Please enter valid numbers separated by commas.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY  // Use secure API key
            },
            body: JSON.stringify({ features })
        });

        if (!response.ok) {
            throw new Error("⚠️ Server error! Please check API connection.");
        }

        const data = await response.json();
        document.getElementById("result").innerText = `Prediction: ${data.prediction} Watts`;

        updateChart(data.prediction);
        updateDeviceStatus(data.prediction);
    } catch (error) {
        document.getElementById("result").innerText = "⚠️ Error fetching prediction!";
        console.error("Prediction Error:", error);
    }
}

// ✅ Fix: Prevent Duplicate Chart Rendering
let chartInstance = null;

function updateChart(prediction) {
    const ctx = document.getElementById("energyChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();  // Remove old chart
    }

    chartInstance = new Chart(ctx, {
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ✅ Update Battery & Inverter Status Dynamically
function updateDeviceStatus(prediction) {
    document.getElementById("battery-status").innerText = (prediction > 50000) ? "🔋 Full" : "⚡ Charging";
    document.getElementById("inverter-status").innerText = (prediction > 30000) ? "🟢 Active" : "🔴 Idle";
}
