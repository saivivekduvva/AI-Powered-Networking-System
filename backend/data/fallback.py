import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_mock_profiles():
    path = os.path.join(BASE_DIR, "mock_profiles.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
