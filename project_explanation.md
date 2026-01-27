# Project Code Explanation

## Overview: The Architecture

Unlike the previous version where everything happened in the browser, this project now uses a **Client–Server Architecture**:

- **The Brain (`weather.py`)**  
  Uses Python, NumPy, and Scikit-Learn to perform the actual data science and mathematics.

- **The Server (`app.py`)**  
  Uses Flask to listen for requests and connect the frontend to the backend.

- **The Face (`weather.js`)**  
  Runs in the browser, asks the server for data, and visualizes it using Chart.js.

---

## PART 1: `weather.py` (The Data Science Brain)

This file contains the core logic. It fetches raw data and transforms it into insights using Machine Learning libraries.

### BLOCK 1: Imports

'''python
import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
'''

**What it does:**

- `requests`: Used to talk to the OpenWeatherMap API.  
- `numpy (as np)`: The industry standard for handling numerical data arrays.  
- `sklearn.linear_model`: Professional Machine Learning library for regression.  
- `datetime`: Formats timestamps into readable times (e.g., `"02:00 PM"`).

---

### BLOCK 2: Fetching Data

'''python
def analyze_weather(city_name):
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={API_KEY}&units=imperial"
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "Invalid city or API error"}

    data = response.json()
'''

**What it does:**

- Constructs the API URL with the city name and API key.  
- Sends a request to OpenWeatherMap.  
- Checks if the city exists (`status_code == 200`).  
- Parses the JSON response so Python can read it.

---

### BLOCK 3: Data Preprocessing

'''python
    forecast_slice = data['list'][:8]
    
    temps = [item['main']['temp'] for item in forecast_slice]
    labels = [datetime.fromtimestamp(item['dt']).strftime('%I:%M %p') for item in forecast_slice]
'''

**What it does:**

- **Slicing:** Takes the first 8 items (8 × 3 hours = 24 hours).  
- **List Comprehensions:** Extracts temperatures and times into simple lists.  
- **Formatting:** Converts Unix timestamps into readable strings.

---

### BLOCK 4: Preparing for Scikit-Learn

'''python
    X = np.array(range(len(temps))).reshape(-1, 1) 
    y = np.array(temps)
'''

**What it does:**

- Converts lists into NumPy arrays (required for ML).  
- `X` (Features): Time steps `[0, 1, 2, ... 7]`.  
- `.reshape(-1, 1)`: Converts `[0,1,2]` → `[[0],[1],[2]]` (2D matrix).  
- `y` (Target): The temperature values.

---

### BLOCK 5: Training the Model

'''python
    model = LinearRegression()
    model.fit(X, y)
    
    slope = model.coef_[0]
    intercept = model.intercept_
'''

**What it does:**

- Creates a regression model.  
- Trains it to find the best-fit line.  
- Extracts the **slope** (rate of change).  
- Extracts the **intercept** (starting value).

---

### BLOCK 6: Predicting & Packaging

'''python
    trend_line = model.predict(X).tolist()
    
    trend_text = "Stable"
    if slope > 0.5: trend_text = "Heating Up 📈"
    elif slope < -0.5: trend_text = "Cooling Down 📉"
'''

**What it does:**

- Generates the predicted trend line.  
- Converts NumPy output to a Python list (JSON-safe).  
- Determines the trend message based on slope.

---

## PART 2: `app.py` (The Web Server)

This file bridges the browser and the Python logic.

### BLOCK 1: Setup

'''python
from flask import Flask, jsonify, request, send_from_directory
from weather import analyze_weather

app = Flask(__name__)
'''

**What it does:**

- Imports Flask tools.  
- Imports `analyze_weather` from `weather.py`.  
- Initializes the web application.

---

### BLOCK 2: File Serving Routes

'''python
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/weather.js')
def serve_js():
    return send_from_directory(BASE_DIR, 'weather.js')
'''

**What it does:**

- `/` serves `index.html`.  
- `/weather.js` serves the JavaScript file.  
- Browsers cannot read local files directly; the server must provide them.

---

### BLOCK 3: The API Endpoint

'''python
@app.route('/api/analyze')
def api_analyze():
    city_name = request.args.get('city')
    if not city_name:
        return jsonify({"error": "Missing city name"}), 400
        
    result = analyze_weather(city_name)
    
    if "error" in result:
        return jsonify(result), 404
        
    return jsonify(result)
'''

**What it does:**

- Defines `/api/analyze` for JavaScript to call.  
- Extracts `city` from the query string.  
- Runs `analyze_weather(city_name)`.  
- Converts Python data into JSON for the browser.

---

## PART 3: `weather.js` (The Frontend Face)

This file handles user interaction and visualization.  
It performs **no mathematics**.

### BLOCK 1: Fetching from Local Server

'''javascript
function getWeather(event) {
  const url = `/api/analyze?city=${cityName}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if(data.error) throw new Error(data.error);
      displayWeatherData(data);
    });
}
'''

**What it does:**

- Calls `/api/analyze` instead of OpenWeatherMap directly.  
- Triggers `api_analyze` in `app.py`.  
- Receives pre-calculated results from Python.

---

### BLOCK 2: Displaying Data (No Math!)

'''javascript
function displayWeatherData(data) {
  const weatherDetails = document.getElementById("weather-details");
  weatherDetails.innerHTML = `
    <p><span>Temperature:</span> ${data.current_temp_f}&deg;F / ${data.current_temp_c}&deg;C</p>
    <p><span>City:</span> ${data.city}</p>
    <p><span>24h Trend:</span> ${data.trend_text}</p>
  `;
}
'''

**What it does:**

- Injects Python-calculated values into HTML.  
- No formulas are used here.  
- It trusts the backend completely.

---

### BLOCK 3: Charting the Data

'''javascript
myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: data.labels,
    datasets: [{
      label: 'Actual Temp',
      data: data.actual_temps,
    }, {
      label: 'Trend Line (Regression)',
      data: data.trend_line,
    }]
  }
});
'''

**What it does:**

- `data.labels`: Time strings from Python.  
- `data.actual_temps`: Plots real temperatures.  
- `data.trend_line`: Plots regression predictions.

---

## Summary: The Data Flow

1. User types **"London"** and clicks Submit.  
2. `weather.js` sends: `GET /api/analyze?city=London`.  
3. `app.py` receives the request and calls `analyze_weather("London")`.  
4. `weather.py` fetches raw data from OpenWeatherMap.  
5. `weather.py` trains a regression model using Scikit-Learn.  
6. `weather.py` returns clean, processed data.  
7. `app.py` converts it to JSON and sends it back.  
8. `weather.js` receives the JSON and draws the chart with Chart.js.

This separation ensures that:
- All **logic and math** live in Python.
- The **browser** only displays results.
- The system is scalable, secure, and professional.
