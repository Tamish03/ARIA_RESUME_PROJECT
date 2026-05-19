from pydantic import BaseModel
from typing import List

class DimensionContribution(BaseModel):
    dim: str
    name: str
    contribution: float

class RecommendationResponse(BaseModel):
    movie_id: int
    title: str
    year: int
    genres: List[str]
    match_score: float
    similarity_dims: List[float]
    why_recommended: str

class ExplanationResponse(BaseModel):
    cosine_similarity: float
    top_dims: List[DimensionContribution]
    neighbor_users: List[int]
