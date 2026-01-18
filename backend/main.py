from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# ---------------- Path Setup ----------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

from ai.ai_engine import recommend
from backend.data.profile_loader import load_profiles

# ---------------- App Init ----------------
app = FastAPI(title="ConnectIQ API", version="1.0")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"  # allow Render frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Health Check ----------------
@app.get("/")
def health():
    return {"status": "ConnectIQ backend running"}

# ---------------- Request Model ----------------
class IntentRequest(BaseModel):
    intent: str

# ---------------- POST API ----------------
@app.post("/recommendations")
def get_recommendations(req: IntentRequest):
    profiles, sources = load_profiles(req.intent)
    results = recommend(req.intent, profiles)

    return {
        "data_sources": sources,
        "recommendations": results
    }

# ---------------- GET API (Optional) ----------------
@app.get("/recommend")
def recommend_get(intent: str):
    profiles, sources = load_profiles(intent)
    results = recommend(intent, profiles)

    return {
        "data_sources": sources,
        "recommendations": results
    }
