from flask import Flask, jsonify, request
from weather import get_weather_data

app = Flask(__name__)

@app.route('/get_weather_data')
def get_weather_data_route():
    city_name = request.args.get('city_name')
    api_key = "30d4741c779ba94c470ca1f63045390a"
    weather_data = get_weather_data(city_name, api_key)
    return jsonify(weather_data)

@app.route('/')
def index():
    return open('index.html').read()

@app.route('/weather.js')
def weather_js():
    return open('weather.js').read()

if __name__ == '__main__':
    app.run()
