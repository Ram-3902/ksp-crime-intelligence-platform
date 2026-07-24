from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import KPISummary
from auth import get_current_user

router = APIRouter(prefix="/kpis", tags=["KPIs"])

@router.get("")
def get_kpis(session: Session = Depends(get_session), _=Depends(get_current_user)):
    kpi = session.exec(select(KPISummary)).first()
    if not kpi:
        return {}
    return {
        "totalCrimes2024":     kpi.total_crimes_2024,
        "totalCrimes2023":     kpi.total_crimes_2023,
        "totalArrests2024":    kpi.total_arrests_2024,
        "convictionRate":      kpi.conviction_rate,
        "cybercrimeSurge":     kpi.cybercrime_surge,
        "hotspotCount":        kpi.hotspot_count,
        "activeGangs":         kpi.active_gangs,
        "pendingCases":        kpi.pending_cases,
        "crimeResolutionRate": kpi.resolution_rate,
        "avgResponseTime":     kpi.avg_response_time,
    }
