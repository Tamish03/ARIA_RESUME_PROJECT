from fastapi import APIRouter
from typing import List
from ..schemas.user import UserResponse, UserNeighbor
from ..services.vae_service import vae_service

router = APIRouter()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    # Mocking user data
    return UserResponse(
        user_id=user_id,
        taste_vector=vae_service.taste_vectors[min(user_id - 1, len(vae_service.taste_vectors)-1)].tolist(),
        engagement_score=93.5,
        top_genres=["Sci-Fi", "Drama", "Action"],
        rating_count=342
    )

@router.get("/{user_id}/neighbors", response_model=List[UserNeighbor])
def get_user_neighbors(user_id: int, k: int = 5):
    neighbors = vae_service.get_neighbors(user_id, k)
    return [
        UserNeighbor(
            user_id=n["user_id"],
            similarity=n["similarity"],
            shared_genres=["Sci-Fi", "Action"] if i % 2 == 0 else ["Drama", "Romance"]
        ) for i, n in enumerate(neighbors)
    ]
