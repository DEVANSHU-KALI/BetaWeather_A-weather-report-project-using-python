from flask import Flask, jsonify, request, send_from_directory
import os
from weather import analyze_weather  # Import the new function

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    # Ensure this points to where your css files are
    return send_from_directory(os.path.join(BASE_DIR, 'static'), filename)

@app.route('/weather.js')
def serve_js():
    return send_from_directory(BASE_DIR, 'weather.js')

# The MAIN API Endpoint
@app.route('/api/analyze')
def api_analyze():
    city_name = request.args.get('city')
    if not city_name:
        return jsonify({"error": "Missing city name"}), 400
        
    result = analyze_weather(city_name)
    
    if "error" in result:
        return jsonify(result), 404
        
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)