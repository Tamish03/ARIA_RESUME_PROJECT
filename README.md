# ARIA 
**Adaptive Recommendation Intelligence Architecture**

A production-grade, portfolio-worthy AI personalization platform integrating variational taste encoding, swarm intelligence for neural architecture search, and generative replay memory to combat catastrophic forgetting.

## 🧠 System Architecture

```text
                  [USER RATINGS (1682D)]
                           │
                           ▼
          ┌─────────────────────────────────┐
          │     STAGE 1: TASTE ENCODER      │
          │         (TensorFlow VAE)        │
          │  Dense → Reparameterize → z     │
          └────────────────┬────────────────┘
                           │ 20D Latent Taste Vector
                           ▼
          ┌─────────────────────────────────┐
          │   STAGE 2: PSO CLASSIFIER       │
          │  (Swarm-Optimized Architecture) │
          │  Input → Dense(256) → Dense(64) │
          └────────────────┬────────────────┘
                           │ Predicts Engagement Score
                           ▼
          ┌─────────────────────────────────┐
          │  STAGE 3: DREAM REPLAY MEMORY   │
          │      (Continual Learning)       │
          │ Generates synthetic Task-1 data │
          │ to prevent model forgetting.    │
          └─────────────────────────────────┘
```

## 🚀 Quick Start

This project requires Node.js 18+ and Python 3.10+.

### 1. Start the Backend (FastAPI + TensorFlow)

```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend (Next.js 14)

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to enter the system.

### Docker Deployment

Alternatively, run the entire stack using Docker Compose:

```bash
docker-compose up --build
```

## 📁 Project Structure

- `frontend/`: Next.js 14 App Router, Tailwind CSS v4, Framer Motion, Three.js, Recharts, D3.js.
- `backend/`: FastAPI server, TensorFlow models, Pydantic schemas.
- `ml/`: Original Jupyter notebooks and serialized model artifacts (`.keras` / `.h5`).

## ⚙️ Features
- **Neural Particles Hero:** Three.js visualization of interconnected data points.
- **Taste Map (UMAP):** D3.js powered 2D projection of user taste clusters.
- **Swarm Convergence:** Real-time particle animation and AUC tracking for hyperparameter search.
- **Dream Cycle:** Generative replay visualization for continual learning over multiple domains.
