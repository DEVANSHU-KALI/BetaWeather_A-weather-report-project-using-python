import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime

# Keep your API Key safe here
API_KEY = "30d4741c779ba94c470ca1f63045390a"

def analyze_weather(city_name):
    # 1. Fetch Forecast Data (same endpoint the JS used)
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={API_KEY}&units=imperial"
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "Invalid city or API error"}

    data = response.json()
    
    # 2. Extract Data (Next 24 hours = 8 points)
    forecast_slice = data['list'][:8]
    
    # Prepare lists for X (time index) and Y (temperature)
    temps = [item['main']['temp'] for item in forecast_slice]
    labels = [datetime.fromtimestamp(item['dt']).strftime('%I:%M %p') for item in forecast_slice]
    
    # Create numpy arrays for Scikit-Learn (Reshaping X is required for sklearn)
    X = np.array(range(len(temps))).reshape(-1, 1) # [[0], [1], [2]...]
    y = np.array(temps)

    # 3. Perform Linear Regression (The Data Science Part)
    model = LinearRegression()
    model.fit(X, y)
    
    slope = model.coef_[0]
    intercept = model.intercept_
    
    # Calculate the "Trend Line" points
    trend_line = model.predict(X).tolist() # Convert back to list for JSON
    
    # 4. Analyze Trend
    trend_text = "Stable"
    if slope > 0.5:
        trend_text = "Heating Up 📈"
    elif slope < -0.5:
        trend_text = "Cooling Down 📉"

    # 5. Extract Current Weather Details for the UI
    current = data['list'][0]
    
    return {
        "city": data['city']['name'],
        "current_temp_f": round(current['main']['temp']),
        "current_temp_c": round((current['main']['temp'] - 32) * 5/9),
        "wind_speed": f"{current['wind']['speed']:.2f} mph",
        "time_of_day": datetime.fromtimestamp(current['dt']).strftime('%I:%M:%S %p'),
        "labels": labels,          # X-axis labels
        "actual_temps": temps,     # Y-axis data (Blue line)
        "trend_line": trend_line,  # Regression data (Yellow line)
        "trend_text": trend_text,  # Analysis result
        "slope": slope
    }