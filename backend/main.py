from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
from fastapi import Depends
from auth.auth_utils import get_current_user


# ---------------- Path Setup ----------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

from ai.ai_engine import recommend
from data.profile_loader import load_profiles

app = FastAPI(title="ConnectIQ API", version="1.0")
from backend.auth.auth_routes import router as auth_router
app.include_router(auth_router)


# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Health ----------------
@app.get("/health")
def health():
    return {"status": "Backend is running"}

@app.get("/protected-test")
def protected_test(current_user = Depends(get_current_user)):
    return {
        "message": "JWT authentication works",
        "user_email": current_user.email
    }

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
