from fastapi import FastAPI
from app.routes import ai

app = FastAPI()

# Mount the AI endpoints under "/api/ai"
app.include_router(ai.router, prefix="/api/ai")

# Run with: python -m uvicorn app.main:app --reload
