from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import MonthlyCrime, DistrictCrime, YoYCrime
from auth import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/crimes", tags=["Crimes"])

@router.get("/monthly")
def get_monthly(session: Session = Depends(get_session), _=Depends(get_current_user)):
    rows = session.exec(select(MonthlyCrime).order_by(MonthlyCrime.month_index)).all()
    labels_ordered = []
    seen = set()
    for r in rows:
        if r.month_label not in seen:
            labels_ordered.append(r.month_label)
            seen.add(r.month_label)
    types = sorted(set(r.crime_type for r in rows))
    datasets = {}
    for t in types:
        datasets[t] = {r.month_label: r.count for r in rows if r.crime_type == t}
    return {
        "labels": labels_ordered,
        "datasets": {t: [datasets[t].get(l, 0) for l in labels_ordered] for t in types},
    }

@router.get("/yoy")
def get_yoy(session: Session = Depends(get_session), _=Depends(get_current_user)):
    rows = session.exec(select(YoYCrime).order_by(YoYCrime.year)).all()
    years = sorted(set(r.year for r in rows))
    types = sorted(set(r.crime_type for r in rows))
    result = {str(y): {} for y in years}
    for r in rows:
        result[str(r.year)][r.crime_type] = r.total
    return {"years": years, "types": types, "data": result}

@router.get("/district/{code}")
def get_district_crimes(code: str, session: Session = Depends(get_session), _=Depends(get_current_user)):
    rows = session.exec(select(DistrictCrime).where(DistrictCrime.district_code == code)).all()
    return {r.crime_type: r.count for r in rows}

@router.get("/districts-summary")
def get_districts_summary(session: Session = Depends(get_session), _=Depends(get_current_user)):
    rows = session.exec(select(DistrictCrime)).all()
    totals: dict = defaultdict(int)
    by_type: dict = defaultdict(lambda: defaultdict(int))
    for r in rows:
        totals[r.district_code] += r.count
        by_type[r.district_code][r.crime_type] = r.count
    return {"totals": dict(totals), "by_type": {k: dict(v) for k, v in by_type.items()}}
