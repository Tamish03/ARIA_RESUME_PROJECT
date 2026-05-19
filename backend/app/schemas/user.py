from pydantic import BaseModel
from typing import List, Optional

class UserResponse(BaseModel):
    user_id: int
    taste_vector: List[float]
    engagement_score: float
    top_genres: List[str]
    rating_count: int

class UserNeighbor(BaseModel):
    user_id: int
    similarity: float
    shared_genres: List[str]
