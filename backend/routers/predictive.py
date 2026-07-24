from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import PredictiveRisk, Anomaly
from auth import get_current_user

router = APIRouter(prefix="/predictive", tags=["Predictive Analytics"])

@router.get("/risk")
def get_risk_scores(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(PredictiveRisk)).all()

@router.get("/anomalies")
def get_anomalies(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(Anomaly).order_by(Anomaly.date.desc())).all()
