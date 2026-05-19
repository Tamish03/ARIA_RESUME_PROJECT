from fastapi import APIRouter
from typing import List
from ..schemas.swarm import SwarmHistory, SwarmBest, SwarmComparison
from ..services.swarm_service import swarm_service

router = APIRouter()

@router.get("/history", response_model=List[SwarmHistory])
def get_swarm_history():
    return swarm_service.get_history()

@router.get("/best", response_model=SwarmBest)
def get_swarm_best():
    return swarm_service.get_best()

@router.get("/comparison", response_model=SwarmComparison)
def get_swarm_comparison():
    return swarm_service.get_comparison()
