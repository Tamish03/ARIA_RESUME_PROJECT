import numpy as np
import tensorflow as tf
from ..models.dream_vae import build_dream_vae, dream_samples

class DreamService:
    def __init__(self):
        self.vae, self.encoder, self.decoder = build_dream_vae()
        # Mock metrics
        self.task1_real = 450
        self.task2_real = 250
        self.dreams_generated = 247
        self.forgetting_reduction = 0.67
        self.cycle_stage = "DREAM"

    def generate_dreams(self, n=10):
        samples = dream_samples(self.decoder, n_samples=n)
        dreams = []
        for i, sample in enumerate(samples):
            dreams.append({
                "dream_id": f"dream_{i}",
                "synthetic_user_vector": sample.tolist(),
                "source_task": 1,
                "mu": np.random.randn(8).tolist(),
                "sigma": np.random.rand(8).tolist()
            })
        self.dreams_generated += n
        return dreams

    def get_status(self):
        return {
            "task1_real": self.task1_real,
            "task2_real": self.task2_real,
            "dreams_generated": self.dreams_generated,
            "forgetting_reduction": self.forgetting_reduction,
            "cycle_stage": self.cycle_stage
        }

    def get_comparison(self):
        return {
            "with_replay": {"task1_acc": 0.89, "task2_acc": 0.91},
            "without_replay": {"task1_acc": 0.34, "task2_acc": 0.92}
        }

dream_service = DreamService()
