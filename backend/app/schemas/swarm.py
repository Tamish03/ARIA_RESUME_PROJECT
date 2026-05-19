from pydantic import BaseModel
from typing import List, Dict, Any

class SwarmHistory(BaseModel):
    iteration: int
    particle_id: int
    position: List[float]
    auc: float
    is_gbest: bool

class SwarmBest(BaseModel):
    lr: float
    dropout: float
    h1: int
    h2: int
    l2: float
    batch_size: int
    auc: float
    architecture_description: str

class SwarmComparison(BaseModel):
    pso: List[Dict[str, Any]]
    random: List[Dict[str, Any]]
