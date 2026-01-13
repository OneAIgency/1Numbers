"""
Monitoring routes
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

from services.orchestrator import OrchestratorService

router = APIRouter()


class SystemStats(BaseModel):
    cpu_usage: float
    memory_usage: float
    active_workers: int
    queued_tasks: int
    cache_hits: int
    cache_misses: int


class TaskStats(BaseModel):
    total: int
    pending: int
    running: int
    completed: int
    failed: int


@router.get("/stats/system", response_model=SystemStats)
async def get_system_stats():
    """Get system statistics"""
    try:
        orchestrator = OrchestratorService.get_instance()
        stats = await orchestrator.get_system_stats()
        return stats
    except Exception as e:
        # Return mock data for now
        return {
            "cpu_usage": 25.5,
            "memory_usage": 45.2,
            "active_workers": 4,
            "queued_tasks": 2,
            "cache_hits": 150,
            "cache_misses": 30
        }


@router.get("/stats/tasks", response_model=TaskStats)
async def get_task_stats():
    """Get task statistics"""
    try:
        orchestrator = OrchestratorService.get_instance()
        stats = await orchestrator.get_task_stats()
        return stats
    except Exception as e:
        # Return mock data for now
        return {
            "total": 50,
            "pending": 5,
            "running": 2,
            "completed": 40,
            "failed": 3
        }


@router.get("/workers")
async def get_workers():
    """Get worker status"""
    try:
        orchestrator = OrchestratorService.get_instance()
        workers = await orchestrator.get_workers()
        return workers
    except Exception as e:
        return []

