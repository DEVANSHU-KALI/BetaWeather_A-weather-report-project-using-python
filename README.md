# Project Title: BetaWeather
- Description: BetaWeather is a data science-powered weather application that visualizes temperature trends using machine learning. Unlike standard weather apps that simply display forecast numbers, BetaWeather performs a Linear Regression analysis on real-time forecast data to calculate the rate of temperature change (slope/beta).

## key features
- Real-Time Data Pipeline: Fetches 24-hour forecast data from the OpenWeatherMap API.
- Machine Learning Integration: Uses Python (Scikit-Learn & NumPy) to fit a linear regression model to the temperature data, calculating the slope ($\beta$) and intercept.
- Trend Analysis: Automatically classifies weather patterns as "Heating Up 📈," "Cooling Down 📉," or "Stable" based on the calculated slope coefficient.
- Interactive Visualization: Displays the actual temperature vs. the predicted regression trend line using Chart.js.

### Tech Stack: 
Python, Flask, Scikit-Learn, NumPy, JavaScript (Chart.js), HTML/CSS.