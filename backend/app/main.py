import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users, recommendations, taste, swarm, dream

app = FastAPI(title="ARIA API", version="1.0.0")

# Load allowed origins from environment variable, default to "*"
allowed_origins_str = os.environ.get("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(taste.router, prefix="/api/taste", tags=["Taste"])
app.include_router(swarm.router, prefix="/api/swarm", tags=["Swarm"])
app.include_router(dream.router, prefix="/api/dream", tags=["Dream"])

@app.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": True, "version": "1.0.0"}
