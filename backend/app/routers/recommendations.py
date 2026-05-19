from fastapi import APIRouter, Query
from typing import List, Optional
from ..schemas.recommendation import RecommendationResponse, ExplanationResponse, DimensionContribution
from ..services.recommender_service import recommender_service

router = APIRouter()

@router.get("/{user_id}", response_model=List[RecommendationResponse])
def get_recommendations(user_id: int, limit: int = Query(20), genre: Optional[str] = None, mode: str = "normal"):
    recs = recommender_service.get_recommendations(user_id, limit)
    if genre:
        recs = [r for r in recs if genre.title() in r["genres"]]
    return recs

@router.get("/{user_id}/explain/{movie_id}", response_model=ExplanationResponse)
def explain_recommendation(user_id: int, movie_id: int):
    return ExplanationResponse(
        cosine_similarity=0.94,
        top_dims=[
            DimensionContribution(dim="z3", name="Sci-Fi Affinity", contribution=0.85),
            DimensionContribution(dim="z7", name="Auteur Preference", contribution=0.72),
            DimensionContribution(dim="z12", name="Pacing", contribution=0.61)
        ],
        neighbor_users=[142, 378, 891]
    )
