let myChart = null;

function ensureChartLoaded(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  s.onload = cb;
  document.head.appendChild(s);
}

// NOTE: Math functions removed! We now trust the Python backend.

function displayWeatherData(data) {
  // Update HTML Text
  const weatherDetails = document.getElementById("weather-details");
  weatherDetails.innerHTML = `
    <p><span>Temperature:</span> ${data.current_temp_f}&deg;F / ${data.current_temp_c}&deg;C</p>
    <p><span>City:</span> ${data.city}</p>
    <p><span>Wind Speed:</span> ${data.wind_speed}</p>
    <p><span>Time of Day:</span> ${data.time_of_day}</p>
    <p><span>Current:</span> ${data.current_temp_f}&deg;F</p>
    <p><span>24h Trend:</span> ${data.trend_text}</p>
  `;

  const ctx = document.getElementById('trendChart').getContext('2d');
  document.querySelector('.chart-container').style.display = 'block';

  if (myChart) myChart.destroy();

  ensureChartLoaded(() => {
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels, // Received from Python
        datasets: [{
          label: 'Actual Temp (°F)',
          data: data.actual_temps, // Received from Python
          borderColor: '#00E5FF',
          borderWidth: 3,
          backgroundColor: 'rgba(0, 229, 255, 0.25)',
          pointRadius: 2,
          tension: 0.4
        }, {
          label: 'Trend Line (Regression)',
          data: data.trend_line, // Received from Python
          borderColor: '#FFD700',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'white' } } },
        scales: {
          x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.15)' } },
          y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.15)' } }
        }
      }
    });
  });
}

function getWeather(event) {
  event.preventDefault();
  const cityInput = document.getElementById("city-input");
  const cityName = cityInput.value;

  // CALL OUR LOCAL PYTHON SERVER, NOT OPENWEATHER DIRECTLY
  const url = `/api/analyze?city=${cityName}`;

  fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Invalid city or server error.");
    })
    .then((data) => {
      if(data.error) throw new Error(data.error);
      displayWeatherData(data);
    })
    .catch((error) => {
      const chartContainer = document.querySelector('.chart-container');
      if (chartContainer) chartContainer.style.display = 'none';
      if (myChart) { myChart.destroy(); myChart = null; }
      
      const weatherDetails = document.getElementById("weather-details");
      weatherDetails.innerHTML = `<p style="color: #F04747; text-align: center; padding: 20px;">${error.message}</p>`;
      
      setTimeout(() => {
        weatherDetails.innerHTML = '<p class="placeholder-text">Enter a city to see weather data</p>';
      }, 5000);
    });
}

const weatherForm = document.getElementById("weather-form");
weatherForm.addEventListener("submit", getWeather);