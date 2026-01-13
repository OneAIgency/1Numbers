"""
Health Routes

Health check endpoints.
"""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.connection import get_db
from src.services.cache import get_cache
from src.services.providers.claude import get_claude
from src.services.providers.ollama import get_ollama
from src.api.schemas import HealthResponse
from src.config import settings

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse)
async def health_check(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> HealthResponse:
    """
    Comprehensive health check for all services.
    """
    # Database health
    db_health = {"status": "healthy"}
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_health = {"status": "unhealthy", "error": str(e)}

    # Cache health
    cache = await get_cache()
    cache_health = await cache.health_check()

    # Claude health
    claude = await get_claude()
    claude_health = await claude.health_check()

    # Ollama health
    ollama = await get_ollama()
    ollama_health = await ollama.health_check()

    # Overall status
    all_healthy = all([
        db_health.get("status") == "healthy",
        cache_health.get("status") == "healthy",
        claude_health.get("status") in ["healthy", "unavailable"],  # Claude being unavailable is ok
    ])

    return HealthResponse(
        status="healthy" if all_healthy else "degraded",
        version=settings.app_version,
        database=db_health,
        cache=cache_health,
        claude=claude_health,
        ollama=ollama_health,
    )


@router.get("/live")
async def liveness_probe() -> dict:
    """
    Kubernetes liveness probe endpoint.
    """
    return {"status": "ok"}


@router.get("/ready")
async def readiness_probe(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    Kubernetes readiness probe endpoint.
    """
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        return {"status": "not_ready"}
