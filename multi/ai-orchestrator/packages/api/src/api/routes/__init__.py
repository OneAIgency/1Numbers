"""
API Routes Module
"""

from src.api.routes.tasks import router as tasks_router
from src.api.routes.projects import router as projects_router
from src.api.routes.modes import router as modes_router
from src.api.routes.monitoring import router as monitoring_router
from src.api.routes.agents import router as agents_router
from src.api.routes.health import router as health_router

__all__ = [
    "tasks_router",
    "projects_router",
    "modes_router",
    "monitoring_router",
    "agents_router",
    "health_router",
]
