from fastapi import APIRouter, Query
from typing import List, Dict, Any
from pydantic import BaseModel
from ..services.dream_service import dream_service

router = APIRouter()

class DreamResponse(BaseModel):
    dream_id: str
    synthetic_user_vector: List[float]
    source_task: int
    mu: List[float]
    sigma: List[float]

@router.post("/generate", response_model=List[DreamResponse])
def generate_dreams(n: int = Query(10)):
    dreams = dream_service.generate_dreams(n)
    return dreams

@router.get("/memory-status")
def get_memory_status():
    return dream_service.get_status()

@router.get("/comparison")
def get_dream_comparison():
    return dream_service.get_comparison()
