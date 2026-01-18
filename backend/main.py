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

app = FastAPI(title="ConnectIQ API", version="1.0")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://connectiq-nhg1.onrender.com",
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

# ---------------- Response Model ----------------
class RecommendationResponse(BaseModel):
    data_sources: list[str]
    recommendations: list[dict]

# ---------------- POST API (KEEP FOR FUTURE) ----------------
@app.post("/recommendations", response_model=RecommendationResponse)
def get_recommendations(req: IntentRequest):
    profiles, source = load_profiles(req.intent)
    results = recommend(req.intent, profiles)

    return {
        "data_sources": [source] if isinstance(source, str) else source,
        "recommendations": results
    }

# ---------------- GET API (FOR FRONTEND) ----------------
@app.get("/recommend")
def recommend_get(intent: str):
    profiles, source = load_profiles(intent)
    results = recommend(intent, profiles)

    return {
        "source": source,
        "recommendations": results
    }
