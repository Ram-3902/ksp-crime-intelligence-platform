from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Offender
from auth import get_current_user
from typing import Optional

router = APIRouter(prefix="/offenders", tags=["Offenders"])

@router.get("")
def get_offenders(
    risk: Optional[str] = None,
    status: Optional[str] = None,
    session: Session = Depends(get_session),
    _=Depends(get_current_user)
):
    query = select(Offender)
    if risk and risk != "ALL":
        query = query.where(Offender.risk == risk)
    if status and status != "ALL":
        query = query.where(Offender.status == status)
    return session.exec(query).all()

@router.get("/{offender_id}")
def get_offender(offender_id: str, session: Session = Depends(get_session), _=Depends(get_current_user)):
    offender = session.exec(select(Offender).where(Offender.offender_id == offender_id)).first()
    if not offender:
        raise HTTPException(404, f"Offender '{offender_id}' not found")
    return offender
