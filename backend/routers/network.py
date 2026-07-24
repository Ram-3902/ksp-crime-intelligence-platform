from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import NetworkNode, NetworkLink
from auth import get_current_user

router = APIRouter(prefix="/network", tags=["Network Graph"])

@router.get("/nodes")
def get_nodes(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(NetworkNode)).all()

@router.get("/links")
def get_links(session: Session = Depends(get_session), _=Depends(get_current_user)):
    return session.exec(select(NetworkLink)).all()

@router.get("/graph")
def get_full_graph(session: Session = Depends(get_session), _=Depends(get_current_user)):
    nodes = session.exec(select(NetworkNode)).all()
    links = session.exec(select(NetworkLink)).all()
    return {
        "nodes": [n.model_dump() for n in nodes],
        "links": [l.model_dump() for l in links],
    }
