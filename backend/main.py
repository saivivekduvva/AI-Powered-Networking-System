from fastapi import FastAPI, HTTPException
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

# ---------------- API ----------------
@app.post("/recommendations")
def recommend_api(req: IntentRequest):
    try:
        intent = req.intent.strip()
        if not intent:
            raise HTTPException(status_code=400, detail="Intent required")

        # ✅ Correct call
        profiles, source = load_profiles(intent)

        results = recommend(intent, profiles)

        return {
            "recommendations": results,
            "data_sources": [source] if isinstance(source, str) else source
        }

    except Exception as e:
        print("ERROR in /recommendations:", str(e))
        raise HTTPException(status_code=500, detail="AI processing failed")
