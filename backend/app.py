from flask import Flask, request, jsonify
import pickle
import numpy as np
import os  # Import os to access environment variables

app = Flask(__name__)

# Load trained model from the correct path
model_path = os.path.join(os.path.dirname(__file__), "xgboost_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

# Get API key from environment variable (set this in Render)
API_KEY = os.getenv("API_KEY")

@app.route('/')
def home():
    return "🌞 API Running!"

@app.route('/predict', methods=['POST'])
def predict():
    api_key = request.headers.get("X-API-KEY")
    if api_key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        data = request.get_json()
        input_features = np.array(data["features"]).reshape(1, -1)
        prediction = model.predict(input_features)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400  # Return error message if something goes wrong

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Get the port from environment variables
    app.run(host="0.0.0.0", port=port)  # Use the correct port
