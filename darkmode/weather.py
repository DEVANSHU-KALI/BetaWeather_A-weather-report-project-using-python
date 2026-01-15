import requests

API_KEY = "30d4741c779ba94c470ca1f63045390a"

def get_weather_data(city_name, api_key=API_KEY):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=imperial"
    response = requests.get(url)
    if response.status_code == 404:
        return {"error": "Invalid city"}
    data = response.json()
    temp = data["main"]["temp"]
    city = data["name"]
    wind_speed = data["wind"]["speed"]
    time = data["dt"]
    return {"temp": temp, "city": city, "wind_speed": wind_speed, "time": time}

