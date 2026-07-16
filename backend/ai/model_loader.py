import os
import joblib

BASE_DIR = os.path.dirname(__file__)

MODEL_PATH = os.path.join(BASE_DIR, "Qadaha_AI_Model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "model_features.pkl")

model = joblib.load(MODEL_PATH)
features = joblib.load(FEATURES_PATH)