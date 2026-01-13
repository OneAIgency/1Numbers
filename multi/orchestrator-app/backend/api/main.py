"""
FastAPI Backend for Orchestrator macOS App
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from api.routes import tasks, projects, monitoring
from api.websocket import ConnectionManager
from services.cache import CacheService
from services.orchestrator import OrchestratorService
import os

# Global services
cache_service = CacheService()
orchestrator_service = OrchestratorService(cache_service)
connection_manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    await cache_service.connect()
    
    # Get project path from environment or use current directory
    project_path = os.getenv("PROJECT_PATH", os.getcwd())
    orchestrator_service.project_path = project_path
    await orchestrator_service.initialize()
    
    yield
    
    # Shutdown
    await cache_service.disconnect()
    await orchestrator_service.shutdown()


app = FastAPI(
    title="Orchestrator API",
    description="Backend API for Multi-Agent Orchestrator",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to macOS app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["monitoring"])


@app.get("/")
async def root():
    return {"message": "Orchestrator API", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "cache": await cache_service.health_check(),
        "orchestrator": orchestrator_service.is_ready()
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle WebSocket messages
            await connection_manager.broadcast(data)
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)


if __name__ == "__main__":
    uvicorn.run(
        "api.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )

