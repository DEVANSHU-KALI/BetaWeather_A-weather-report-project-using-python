import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
from sklearn.metrics import mean_squared_error, r2_score

# If the key is new, wait up to 2 hours for activation.
API_KEY = "your_openweathermap_api_key_here"

def analyze_weather(city_name):
    # 1. Fetch Forecast Data
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={API_KEY}&units=imperial"
    
    try:
        response = requests.get(url, timeout=10)
        # Check for activation (401) or misspelled city (404) errors
        if response.status_code != 200:
            error_msg = response.json().get('message', 'API request failed')
            return {"error": f"API Error: {error_msg} (Status: {response.status_code})"}
    except requests.RequestException as e:
        return {"error": f"Connection error: {str(e)}"}

    data = response.json()
    
    # 2. Extract Data (Next 24 hours = 8 points)
    forecast_slice = data['list'][:8]
    temps = [item['main']['temp'] for item in forecast_slice]
    labels = [datetime.fromtimestamp(item['dt']).strftime('%I:%M %p') for item in forecast_slice]
    
    # 3. Prepare for Scikit-Learn
    X = np.array(range(len(temps))).reshape(-1, 1) 
    y = np.array(temps)

    # 4. Perform Linear Regression
    model = LinearRegression()
    model.fit(X, y)
    
    slope = model.coef_[0]
    intercept = model.intercept_
    
    # Generate Predictions for evaluation
    y_pred = model.predict(X)
    trend_line = y_pred.tolist() 

    # 5. Evaluation Metrics
    # R2 (R-squared) measures fit; closer to 1.0 is better.
    # MSE (Mean Squared Error) measures average error; lower is better.
    r2 = r2_score(y, y_pred)
    mse = mean_squared_error(y, y_pred)

    # 6. Analyze Trend
    trend_text = "Stable"
    if slope > 0.5:
        trend_text = "Heating Up 📈"
    elif slope < -0.5:
        trend_text = "Cooling Down 📉"

    # 7. Extract Details for UI
    current = data['list'][0]
    
    return {
        "city": data['city']['name'],
        "current_temp_f": round(current['main']['temp']),
        "current_temp_c": round((current['main']['temp'] - 32) * 5/9),
        "wind_speed": f"{current['wind']['speed']:.2f} mph",
        "time_of_day": datetime.fromtimestamp(current['dt']).strftime('%I:%M:%S %p'),
        "labels": labels,
        "actual_temps": temps,
        "trend_line": trend_line,
        "trend_text": trend_text,
        "slope": slope,
        "mse": round(mse, 4), 
        "r2": round(r2, 4)
    }