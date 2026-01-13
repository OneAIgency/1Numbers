"""
AI Orchestrator API

Main FastAPI application entry point.
"""

import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
import structlog

from src.config import settings
from src.db.connection import init_db, close_db
from src.services.cache import get_cache, close_cache
from src.services.providers.claude import get_claude, close_claude
from src.services.providers.ollama import get_ollama, close_ollama
from src.api.routes import (
    tasks_router,
    projects_router,
    modes_router,
    monitoring_router,
    agents_router,
    health_router,
)
from src.api.websocket import get_manager

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer() if settings.log_format == "json" else structlog.dev.ConsoleRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager"""
    logger.info(
        "Starting AI Orchestrator API",
        version=settings.app_version,
        environment=settings.environment,
    )

    # Initialize services with graceful fallbacks
    services_status = {
        "database": False,
        "cache": False,
        "claude": False,
        "ollama": False,
    }

    try:
        await init_db()
        services_status["database"] = True
        logger.info("Database connected")
    except Exception as e:
        logger.warning("Database not available", error=str(e))

    try:
        await get_cache()
        services_status["cache"] = True
        logger.info("Cache connected")
    except Exception as e:
        logger.warning("Cache not available", error=str(e))

    try:
        await get_claude()
        services_status["claude"] = True
        logger.info("Claude provider initialized")
    except Exception as e:
        logger.warning("Claude provider not available", error=str(e))

    try:
        await get_ollama()
        services_status["ollama"] = True
        logger.info("Ollama provider initialized")
    except Exception as e:
        logger.warning("Ollama provider not available", error=str(e))

    # Store services status in app state
    app.state.services_status = services_status

    active_services = [k for k, v in services_status.items() if v]
    logger.info("Startup complete", active_services=active_services)

    yield

    # Cleanup
    logger.info("Shutting down AI Orchestrator API")

    if services_status["ollama"]:
        await close_ollama()
    if services_status["claude"]:
        await close_claude()
    if services_status["cache"]:
        await close_cache()
    if services_status["database"]:
        await close_db()

    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered development orchestration platform",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
API_PREFIX = "/api/v2"
app.include_router(tasks_router, prefix=API_PREFIX)
app.include_router(projects_router, prefix=API_PREFIX)
app.include_router(modes_router, prefix=API_PREFIX)
app.include_router(monitoring_router, prefix=API_PREFIX)
app.include_router(agents_router, prefix=API_PREFIX)
app.include_router(health_router, prefix=API_PREFIX)


@app.get("/")
async def root() -> dict:
    """Root endpoint"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "api": API_PREFIX,
    }


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str = Query(default=None),
) -> None:
    """
    WebSocket endpoint for real-time updates.

    Query parameters:
        client_id: Optional client identifier (auto-generated if not provided)

    Message protocol:
        Subscribe: {"action": "subscribe", "channel": "tasks"}
        Unsubscribe: {"action": "unsubscribe", "channel": "tasks"}

    Channels:
        - tasks: All task updates
        - task:{id}: Updates for a specific task
        - monitoring: System metrics updates
    """
    manager = get_manager()

    # Generate client ID if not provided
    if not client_id:
        client_id = str(uuid.uuid4())

    await manager.connect(websocket, client_id)

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")

            if action == "subscribe":
                channel = data.get("channel")
                if channel:
                    manager.subscribe(client_id, channel)
                    await websocket.send_json({
                        "type": "subscribed",
                        "channel": channel,
                    })

            elif action == "unsubscribe":
                channel = data.get("channel")
                if channel:
                    manager.unsubscribe(client_id, channel)
                    await websocket.send_json({
                        "type": "unsubscribed",
                        "channel": channel,
                    })

            elif action == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        logger.error("WebSocket error", client_id=client_id, error=str(e))
        manager.disconnect(client_id)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
