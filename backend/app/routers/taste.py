from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from ..services.vae_service import vae_service

router = APIRouter()

class InterpolateRequest(BaseModel):
    user_a_id: int
    user_b_id: int
    alpha: float

@router.get("/{user_id}/vector")
def get_taste_vector(user_id: int):
    idx = user_id - 1
    if idx < 0 or idx >= len(vae_service.taste_vectors):
        z = np.random.randn(20)
        x, y = 0.0, 0.0
    else:
        z = vae_service.taste_vectors[idx]
        x, y = vae_service.umap_embeddings[idx]
        
    return {
        "z": z.tolist(),
        "dim_names": [
            "Genre Affinity", "Rating Intensity", "Viewing Breadth", "Recency Bias",
            "Franchise Pull", "Indie Tendency", "Auteur Preference", "Rewatch Drive"
        ] + [f"Latent {i}" for i in range(9, 21)],
        "umap_x": float(x),
        "umap_y": float(y)
    }

@router.get("/umap-projection")
def get_umap_projection():
    return vae_service.get_umap_projection()

@router.post("/interpolate")
def interpolate_taste(req: InterpolateRequest):
    idx_a = req.user_a_id - 1
    idx_b = req.user_b_id - 1
    
    vec_a = vae_service.taste_vectors[idx_a] if idx_a < len(vae_service.taste_vectors) else np.random.randn(20)
    vec_b = vae_service.taste_vectors[idx_b] if idx_b < len(vae_service.taste_vectors) else np.random.randn(20)
    
    z_interpolated = (1 - req.alpha) * vec_a + req.alpha * vec_b
    return {
        "z_interpolated": z_interpolated.tolist(),
        "predicted_ratings_delta": np.random.uniform(-0.5, 0.5, size=5).tolist()
    }
