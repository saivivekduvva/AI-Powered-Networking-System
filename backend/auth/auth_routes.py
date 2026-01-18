from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db.models import User
from backend.db.database import get_db, engine
from backend.db import models
from backend.auth.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])

models.Base.metadata.create_all(bind=engine)

@router.post("/signup")
def signup(email: str, password: str, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=email,
        password_hash=get_password_hash(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully"}

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(user_id=user.id)


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
