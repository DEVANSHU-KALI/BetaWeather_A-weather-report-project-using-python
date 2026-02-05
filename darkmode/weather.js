let myChart = null;
let currentUnit = 'F'; // Default unit
let currentData = null; // Store data for unit toggling

// --- DOM ELEMENTS ---
const cityInput = document.getElementById("city-input");
const tempDisplay = document.getElementById("temp-display");
const weatherDesc = document.getElementById("weather-desc"); // You might need to add this ID to HTML if missing, or use existing logic
const feelsLike = document.getElementById("feels-like");
const aiText = document.getElementById("ai-prediction");
const locationText = document.getElementById("current-location");
const timeDisplay = document.getElementById("time-display");

// Stats Elements
const r2Val = document.getElementById("r2-val");
const mseVal = document.getElementById("mse-val");
const windVal = document.getElementById("wind-val");
const slopeVal = document.getElementById("slope-val");

// --- 1. FETCH DATA FROM PYTHON ---
function getWeather(cityName) {
    // Show loading state
    aiText.innerText = "Analyzing...";
    aiText.style.color = "#ccc";

    fetch(`/api/analyze?city=${cityName}`)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            if(data.error) throw new Error(data.error);
            currentData = data; // Save for unit switching
            updateUI(data);
        })
        .catch(error => {
            console.error(error);
            aiText.innerText = "Error: " + error.message;
            aiText.style.color = "#ff4d4d";
        });
}

// --- 2. UPDATE THE UI ---
function updateUI(data) {
    // A. Update Text Info
    locationText.innerText = data.city;
    timeDisplay.innerText = data.time_of_day;
    windVal.innerText = data.wind_speed;
    
    // Model Stats
    r2Val.innerText = data.r2; 
    mseVal.innerText = data.mse;
    slopeVal.innerText = data.slope.toFixed(4);

    // B. Update Temperature (Handle Units)
    updateTempDisplay();

    // C. Update AI Verdict
    aiText.innerText = data.trend_text;
    if(data.trend_text.includes("Heating")) {
        aiText.style.color = "#ffeb3b"; // Yellow/Hot
    } else if(data.trend_text.includes("Cooling")) {
        aiText.style.color = "#4facfe"; // Blue/Cool
    } else {
        aiText.style.color = "#fff"; // White/Stable
    }

    // D. Update Graph
    updateChart(data);
}

// --- 3. HANDLE UNITS (C/F) ---
function updateTempDisplay() {
    if(!currentData) return;

    if(currentUnit === 'F') {
        tempDisplay.innerText = currentData.current_temp_f + "°";
        // Simple calculation for "feels like" if not provided by API, or just use temp
        feelsLike.innerText = (currentData.current_temp_f - 2) + "°"; 
    } else {
        tempDisplay.innerText = currentData.current_temp_c + "°";
        feelsLike.innerText = (currentData.current_temp_c - 1) + "°";
    }
}

// Event Listeners for Buttons
document.getElementById('btn-c').addEventListener('click', (e) => {
    currentUnit = 'C';
    e.target.classList.add('active');
    document.getElementById('btn-f').classList.remove('active');
    updateTempDisplay();
});

document.getElementById('btn-f').addEventListener('click', (e) => {
    currentUnit = 'F';
    e.target.classList.add('active');
    document.getElementById('btn-c').classList.remove('active');
    updateTempDisplay();
});

// --- 4. RENDER CHART (The Linear Regression Visuals) ---
function updateChart(data) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels, // From Python
            datasets: [
                {
                    label: 'Actual Forecast',
                    data: data.actual_temps, // From Python
                    borderColor: '#4facfe',
                    backgroundColor: '#4facfe',
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    type: 'scatter' // Show as points
                },
                {
                    label: 'Regression Line (AI Prediction)',
                    data: data.trend_line, // From Python (y_pred)
                    borderColor: '#ff7b54',
                    borderWidth: 3,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    tension: 0 // Straight line
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'nearest', intersect: true, axis: 'x' },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: { display: true, title: { display: true, text: 'Temp (°F)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// --- 5. SEARCH LISTENER ---
cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if(city) getWeather(city);
    }
});