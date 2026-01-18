from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# ---------------- Path Setup (FIRST) ----------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

# ---------------- App Init ----------------
app = FastAPI(title="ConnectIQ API", version="1.0")

# ---------------- Database ----------------
from backend.db.database import engine
from backend.db import models

models.Base.metadata.create_all(bind=engine)

# ---------------- Auth ----------------
from backend.auth.auth_routes import router as auth_router
from backend.auth.auth_utils import get_current_user
from backend.db.models import User

app.include_router(auth_router)

# ---------------- User Routes ----------------
from backend.routes.user_routes import router as user_router
app.include_router(user_router)

# ---------------- AI ----------------
from ai.ai_engine import recommend
from backend.data.profile_loader import load_profiles

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

# ---------------- Protected Test ----------------
@app.get("/protected-test")
def protected_test(current_user: User = Depends(get_current_user)):
    return {
        "message": "Authentication successful",
        "user_id": current_user.id,
        "email": current_user.email
    }

# ---------------- Request Model ----------------
class IntentRequest(BaseModel):
    intent: str

# ---------------- Recommendation API ----------------
@app.post("/recommendations")
def get_recommendations(
    req: IntentRequest,
    current_user: User = Depends(get_current_user)
):
    profiles, sources = load_profiles(req.intent)
    results = recommend(req.intent, profiles)

    return {
        "sources": sources,
        "count": len(results),
        "recommendations": results
    }
