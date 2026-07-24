from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import Hotspot
from auth import get_current_user

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.get("")
def get_hotspots(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(Hotspot)).all()
