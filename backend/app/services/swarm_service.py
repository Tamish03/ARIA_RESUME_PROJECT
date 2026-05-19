import random

class SwarmService:
    def __init__(self):
        self.particles = 12
        self.iterations = 10
        self.history = self._generate_mock_history()
        self.best_config = {
            "lr": 0.00174377,
            "dropout": 0.45053, # Dropout layer 1 rate (Dropout layer 2 is 0.27032)
            "h1": 416,
            "h2": 203,
            "l2": 0.00479274,
            "batch_size": 128,
            "auc": 0.9572,
            "architecture_description": "Input(8) -> Dense(416) -> BN -> ReLU -> Dropout(0.45) -> Dense(203) -> BN -> ReLU -> Dropout(0.27) -> Dense(1) -> Sigmoid"
        }

    def _generate_mock_history(self):
        history = []
        for i in range(1, self.iterations + 1):
            for p in range(self.particles):
                auc_base = 0.75 + (i * 0.015)
                auc = min(0.9345, auc_base + random.uniform(-0.05, 0.05))
                is_gbest = False
                if i == self.iterations and p == 0:
                    auc = 0.9345
                    is_gbest = True
                    
                history.append({
                    "iteration": i,
                    "particle_id": p,
                    "position": [
                        random.uniform(-4, -2), # log(LR)
                        random.uniform(0.1, 0.5), # Dropout
                        random.uniform(64, 512),  # H1
                        random.uniform(32, 256),  # H2
                        random.uniform(-6, -3), # log(L2)
                        random.choice([32, 64, 128, 256]) # Batch
                    ],
                    "auc": auc,
                    "is_gbest": is_gbest
                })
        return history

    def get_history(self):
        return self.history

    def get_best(self):
        return self.best_config

    def get_comparison(self):
        pso = [{"iter": i, "auc": 0.75 + (i * 0.018)} for i in range(1, 11)]
        pso[-1]["auc"] = 0.9345
        random_search = [{"iter": i, "auc": 0.70 + (i * 0.008)} for i in range(1, 11)]
        return {"pso": pso, "random": random_search}

swarm_service = SwarmService()
