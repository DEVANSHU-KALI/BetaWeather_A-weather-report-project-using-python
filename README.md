# BetaWeather 🌤️

**BetaWeather** is a data science-powered weather application that visualizes temperature trends using machine learning. Unlike standard weather apps that simply display forecast numbers, BetaWeather performs a **Linear Regression** analysis on real-time forecast data to calculate the rate of temperature change (slope/beta).

![BetaWeather Dashboard](image_c0884d.jpg)

## 🚀 Key Features

* **Real-Time Data Pipeline**: Fetches 24-hour forecast data from the OpenWeatherMap API using Python `requests`.
* **Machine Learning Integration**: Uses **Scikit-Learn** & **NumPy** to fit a linear regression model to the temperature data, calculating the slope ($\beta$) and intercept.
* **Trend Analysis**: Automatically classifies weather patterns as "Heating Up 📈," "Cooling Down 📉," or "Stable" based on the calculated slope coefficient.
* **Interactive Visualization**: Displays the actual temperature vs. the predicted regression trend line using **Chart.js**.

## 🛠️ Tech Stack

* **Backend**: Python, Flask
* **ML & Data**: Scikit-Learn, NumPy
* **Frontend**: HTML5, CSS3, JavaScript (Chart.js)

## 📦 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd BetaWeather
    ```

2.  **Install Requirements**
    I recommend using `uv` for faster installation, but standard `pip` works too.

    * **Using uv (Recommended):**
        ```bash
        # If you don't have uv installed yet:
        pip install uv
        
        # Install dependencies
        uv pip install -r requirements.txt
        ```

    * **Using standard pip:**
        ```bash
        pip install -r requirements.txt
        ```

3.  **Configure API Key**
    * Open `weather.py`.
    * Paste your **OpenWeatherMap API Key** into the `API_KEY` variable (or set it as an environment variable `OPEN_WEATHER_API_KEY`).

## 🏃‍♂️ How to Run

1.  **Start the Server**
    Run the following command from the project root directory:
    ```bash
    uv run -- python app.py
    # OR if using standard python:
    python app.py
    ```

2.  **Open the Dashboard**
    Open your browser and navigate to:
    ```
    http://localhost:5000
    ```

3.  **Search for a City**
    Type a city name (e.g., "Hyderabad") and hit **Enter**.

### ⚠️ Note on City Names
If the app cannot find a city, try being more specific. OpenWeatherMap sometimes distinguishes between locations with the same name.
* *Example:* Use "New York, US" instead of just "New York".
* *Example:* Use "London, GB" instead of just "London".

## 📂 Project Structure

```text
BetaWeather/
├── app.py              # Flask server (The Bridge)
├── weather.py          # ML Logic (The Brain)
├── weather.js          # Frontend Logic (The Face)
├── index.html          # Main Dashboard UI
└── requirements.txt    # Python dependencies
```

### 2. Updated `project_explanation.md`

Replace your current `project_explanation.md` with this content:

```markdown
# Project Code Explanation

## Overview: The Architecture

This project uses a **Client–Server Architecture** to separate the user interface from the heavy data science logic:

- **The Brain (`weather.py`)**: Uses Python, NumPy, and Scikit-Learn to perform Linear Regression and analyze trends.
- **The Server (`app.py`)**: Uses Flask to serve the HTML pages and create an API endpoint (`/api/analyze`).
- **The Face (`weather.js`)**: Runs in the browser, fetches analyzed data from our local server, and renders it using Chart.js.

---

## PART 1: `weather.py` (The Data Science Brain)

This file contains the core logic. It fetches raw data and transforms it into insights using Machine Learning libraries.

### BLOCK 1: Imports & Setup
```python
import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
import os 
```
API_KEY = os.getenv("OPEN_WEATHER_API_KEY")