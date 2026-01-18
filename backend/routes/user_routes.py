from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.auth_utils import get_current_user
from backend.db.database import get_db
from backend.db.models import SearchHistory, User

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/search-history")
def get_search_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.timestamp.desc())
        .all()
    )

    return history
