from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model
model = pickle.load(open("xgboost_model.pkl", "rb"))

API_KEY = "4620e3f7eee6dd16b11907669672adac"

@app.route('/')
def home():
    return "🌞 API Running!"

@app.route('/predict', methods=['POST'])
def predict():
    api_key = request.headers.get("X-API-KEY")
    if api_key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    input_features = np.array(data["features"]).reshape(1, -1)
    prediction = model.predict(input_features)
    return jsonify({"prediction": prediction.tolist()})

if __name__ == "__main__":
    app.run(debug=True)
