from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import District
from auth import get_current_user

router = APIRouter(prefix="/districts", tags=["Districts"])

@router.get("")
def get_districts(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(District)).all()

@router.get("/{code}")
def get_district(code: str, session: Session = Depends(get_session), _=Depends(get_current_user)):
    from fastapi import HTTPException
    d = session.exec(select(District).where(District.code == code)).first()
    if not d:
        raise HTTPException(404, f"District '{code}' not found")
    return d
