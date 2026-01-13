"""
Monitoring Routes

System statistics and cost tracking.
"""

from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.connection import get_db
from src.models.task import Task, Execution
from src.models.cost import CostTracking
from src.api.schemas import SystemStats, CostStats

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


@router.get("/stats", response_model=SystemStats)
async def get_system_stats(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SystemStats:
    """
    Get system statistics.
    """
    # Total tasks
    total_result = await db.execute(select(func.count()).select_from(Task))
    total_tasks = total_result.scalar() or 0

    # Completed tasks
    completed_result = await db.execute(
        select(func.count()).select_from(Task).where(Task.status == "completed")
    )
    completed_tasks = completed_result.scalar() or 0

    # Failed tasks
    failed_result = await db.execute(
        select(func.count()).select_from(Task).where(Task.status == "failed")
    )
    failed_tasks = failed_result.scalar() or 0

    # Running tasks
    running_result = await db.execute(
        select(func.count()).select_from(Task).where(Task.status == "running")
    )
    running_tasks = running_result.scalar() or 0

    # Total executions
    exec_result = await db.execute(select(func.count()).select_from(Execution))
    total_executions = exec_result.scalar() or 0

    # Average task duration (for completed tasks)
    avg_duration_result = await db.execute(
        select(func.avg(Execution.duration_ms))
        .where(Execution.status == "completed")
        .where(Execution.duration_ms.isnot(None))
    )
    avg_duration = avg_duration_result.scalar()

    # Success rate
    success_rate = 0.0
    if total_tasks > 0:
        success_rate = (completed_tasks / total_tasks) * 100

    return SystemStats(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        failed_tasks=failed_tasks,
        running_tasks=running_tasks,
        total_executions=total_executions,
        avg_task_duration_ms=float(avg_duration) if avg_duration else None,
        success_rate=round(success_rate, 2),
    )


@router.get("/costs", response_model=CostStats)
async def get_cost_stats(
    db: Annotated[AsyncSession, Depends(get_db)],
    days: Annotated[int, Query(ge=1, le=365)] = 30,
) -> CostStats:
    """
    Get cost statistics for a time period.
    """
    period_start = datetime.utcnow() - timedelta(days=days)
    period_end = datetime.utcnow()

    # Base query for the period
    base_query = select(CostTracking).where(CostTracking.created_at >= period_start)

    # Total cost
    total_cost_result = await db.execute(
        select(func.sum(CostTracking.cost_usd)).where(CostTracking.created_at >= period_start)
    )
    total_cost = total_cost_result.scalar() or 0.0

    # Cost by provider
    provider_result = await db.execute(
        select(CostTracking.provider, func.sum(CostTracking.cost_usd))
        .where(CostTracking.created_at >= period_start)
        .group_by(CostTracking.provider)
    )
    cost_by_provider = {row[0]: float(row[1]) for row in provider_result.all()}

    # Cost by model
    model_result = await db.execute(
        select(CostTracking.model, func.sum(CostTracking.cost_usd))
        .where(CostTracking.created_at >= period_start)
        .group_by(CostTracking.model)
    )
    cost_by_model = {row[0]: float(row[1]) for row in model_result.all()}

    # Total tokens
    tokens_result = await db.execute(
        select(
            func.sum(CostTracking.tokens_input),
            func.sum(CostTracking.tokens_output),
        ).where(CostTracking.created_at >= period_start)
    )
    tokens_row = tokens_result.one()
    total_tokens_input = tokens_row[0] or 0
    total_tokens_output = tokens_row[1] or 0

    return CostStats(
        total_cost=float(total_cost),
        cost_by_provider=cost_by_provider,
        cost_by_model=cost_by_model,
        total_tokens_input=total_tokens_input,
        total_tokens_output=total_tokens_output,
        period_start=period_start,
        period_end=period_end,
    )


@router.get("/metrics")
async def get_prometheus_metrics(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> str:
    """
    Get Prometheus-compatible metrics.
    """
    metrics = []

    # Task metrics
    total_result = await db.execute(select(func.count()).select_from(Task))
    total_tasks = total_result.scalar() or 0
    metrics.append(f"orchestrator_tasks_total {total_tasks}")

    # Status breakdown
    for status in ["pending", "running", "completed", "failed"]:
        result = await db.execute(
            select(func.count()).select_from(Task).where(Task.status == status)
        )
        count = result.scalar() or 0
        metrics.append(f'orchestrator_tasks_by_status{{status="{status}"}} {count}')

    # Mode breakdown
    mode_result = await db.execute(
        select(Task.mode, func.count()).group_by(Task.mode)
    )
    for mode, count in mode_result.all():
        metrics.append(f'orchestrator_tasks_by_mode{{mode="{mode}"}} {count}')

    # Cost metrics
    cost_result = await db.execute(select(func.sum(CostTracking.cost_usd)))
    total_cost = cost_result.scalar() or 0.0
    metrics.append(f"orchestrator_total_cost_usd {total_cost}")

    # Token metrics
    tokens_result = await db.execute(
        select(
            func.sum(CostTracking.tokens_input),
            func.sum(CostTracking.tokens_output),
        )
    )
    tokens_row = tokens_result.one()
    metrics.append(f"orchestrator_tokens_input_total {tokens_row[0] or 0}")
    metrics.append(f"orchestrator_tokens_output_total {tokens_row[1] or 0}")

    return "\n".join(metrics)
