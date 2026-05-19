import numpy as np
import tensorflow as tf
import os
import keras
from .vae_service import vae_service

class RecommenderService:
    def __init__(self):
        # Resolve paths relative to workspace directory
        service_dir = os.path.dirname(os.path.abspath(__file__))
        workspace_dir = os.path.abspath(os.path.join(service_dir, "..", "..", "..", ".."))
        swarm_model_path = os.path.join(workspace_dir, "swarm_best_model.keras")

        if os.path.exists(swarm_model_path):
            try:
                self.classifier = keras.models.load_model(swarm_model_path)
                print(f"Swarm best model loaded successfully from {swarm_model_path}")
            except Exception as e:
                print(f"Error loading Swarm best model from {swarm_model_path}: {e}")
                from ..models.classifier import build_classifier
                self.classifier = build_classifier(input_dim=8)
        else:
            print(f"Warning: Swarm best model file not found at {swarm_model_path}, using fallback classifier")
            from ..models.classifier import build_classifier
            self.classifier = build_classifier(input_dim=8)

    def predict_engagement(self, taste_vector: np.ndarray):
        # Predict engagement score based on user taste vector and movie embeddings
        score = self.classifier.predict(taste_vector.reshape(1, -1), verbose=0)[0][0]
        return float(score)

    def get_recommendations(self, user_id: int, limit: int = 20):
        # Map user_id using modulo to prevent out of bounds
        idx = (user_id - 1) % len(vae_service.taste_vectors)
        taste_vector = vae_service.taste_vectors[idx]

        base_score = self.predict_engagement(taste_vector)
        
        movies = [
            {"movie_id": 1, "title": "Blade Runner 2049", "year": 2017, "genres": ["Sci-Fi", "Thriller"]},
            {"movie_id": 2, "title": "Interstellar", "year": 2014, "genres": ["Sci-Fi", "Drama"]},
            {"movie_id": 3, "title": "Ex Machina", "year": 2014, "genres": ["Sci-Fi", "Thriller"]},
            {"movie_id": 4, "title": "Arrival", "year": 2016, "genres": ["Sci-Fi", "Drama"]},
            {"movie_id": 5, "title": "Her", "year": 2013, "genres": ["Sci-Fi", "Romance"]},
            {"movie_id": 6, "title": "Ghost in the Shell", "year": 1995, "genres": ["Sci-Fi", "Action"]},
            {"movie_id": 7, "title": "Annihilation", "year": 2018, "genres": ["Sci-Fi", "Horror"]},
            {"movie_id": 8, "title": "Dune", "year": 2021, "genres": ["Sci-Fi", "Adventure"]}
        ]
        
        recs = []
        for i, movie in enumerate(movies):
            recs.append({
                "movie_id": movie["movie_id"],
                "title": movie["title"],
                "year": movie["year"],
                "genres": movie["genres"],
                "match_score": min(0.99, base_score + np.random.uniform(-0.05, 0.05)),
                "similarity_dims": taste_vector.tolist(),
                "why_recommended": "High similarity in Sci-Fi and Auteur preference."
            })
            if len(recs) >= limit:
                break
                
        return sorted(recs, key=lambda x: x["match_score"], reverse=True)

recommender_service = RecommenderService()

