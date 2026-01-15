function displayWeatherData(data) {
  const temperatureF = data.main.temp.toFixed(0) + "&deg;F"; // convert temperature to string and add degree symbol
  const temperatureC = ((data.main.temp - 32) * (5 / 9)).toFixed(0) + "&deg;C"; // convert temperature to string and add degree symbol
  const cityName = data.name;
  const windSpeed = data.wind.speed.toFixed(2) + " mph";
  const timeOfDay = new Date(data.dt * 1000).toLocaleTimeString(); // convert UNIX timestamp to local time

  const weatherDetails = document.getElementById("weather-details");
  weatherDetails.innerHTML = `
    <p><span>Temperature:</span> ${temperatureF} / ${temperatureC}</p>
    <p><span>City:</span> ${cityName}</p>
    <p><span>Wind Speed:</span> ${windSpeed}</p>
    <p><span>Time of Day:</span> ${timeOfDay}</p>
  `;
}

function getWeather(event) {
  event.preventDefault(); // prevent form from submitting
  const cityInput = document.getElementById("city-input");
  const cityName = cityInput.value;
  const apiKey = "30d4741c779ba94c470ca1f63045390a"; // add your OpenWeatherMap API key here

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Invalid city. Please try again.");
    })
    .then((data) => {
      displayWeatherData(data);
    })
    .catch((error) => {
      const weatherDetails = document.getElementById("weather-details");
      weatherDetails.innerHTML = `<p>${error.message}</p>`;
      setTimeout(() => {
        weatherDetails.innerHTML = "";
      }, 5000);
    });
}

const weatherForm = document.getElementById("weather-form");
weatherForm.addEventListener("submit", getWeather);
