"""
Task Routes

CRUD operations for tasks.
"""

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import structlog

from src.db.connection import get_db
from src.models.task import Task, Execution
from src.api.schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    ExecutionResponse,
    TaskStatus,
    SuccessResponse,
    ErrorResponse,
)

logger = structlog.get_logger()
router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TaskResponse:
    """
    Create a new task.

    The task will be queued for execution based on the selected mode.
    """
    task = Task(
        description=task_data.description,
        project_id=task_data.project_id,
        mode=task_data.mode.value,
        priority=task_data.priority,
        status="pending",
    )

    db.add(task)
    await db.commit()
    await db.refresh(task)

    logger.info(
        "Task created",
        task_id=task.id,
        mode=task.mode,
        description=task.description[:50],
    )

    return TaskResponse(**task.to_dict(), executions=[])


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    db: Annotated[AsyncSession, Depends(get_db)],
    status: Annotated[TaskStatus | None, Query()] = None,
    project_id: Annotated[str | None, Query()] = None,
    mode: Annotated[str | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> TaskListResponse:
    """
    List tasks with optional filtering.
    """
    query = select(Task).order_by(Task.created_at.desc())

    # Apply filters
    if status:
        query = query.where(Task.status == status.value)
    if project_id:
        query = query.where(Task.project_id == project_id)
    if mode:
        query = query.where(Task.mode == mode.upper())

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    tasks = result.scalars().all()

    return TaskListResponse(
        tasks=[TaskResponse(**t.to_dict(), executions=None) for t in tasks],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    include_executions: Annotated[bool, Query()] = True,
) -> TaskResponse:
    """
    Get a task by ID with optional execution details.
    """
    query = select(Task).where(Task.id == task_id)
    if include_executions:
        query = query.options(selectinload(Task.executions))

    result = await db.execute(query)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    executions = None
    if include_executions and task.executions:
        executions = [ExecutionResponse(**e.to_dict()) for e in task.executions]

    return TaskResponse(**task.to_dict(), executions=executions)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TaskResponse:
    """
    Update a task's status or priority.
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_data.status is not None:
        old_status = task.status
        task.status = task_data.status.value

        # Update timestamps
        if task_data.status == TaskStatus.RUNNING and not task.started_at:
            task.started_at = datetime.now()
        elif task_data.status in (TaskStatus.COMPLETED, TaskStatus.FAILED):
            task.completed_at = datetime.now()

        logger.info(
            "Task status updated",
            task_id=task_id,
            old_status=old_status,
            new_status=task.status,
        )

    if task_data.priority is not None:
        task.priority = task_data.priority

    await db.commit()
    await db.refresh(task)

    return TaskResponse(**task.to_dict(), executions=None)


@router.delete("/{task_id}", response_model=SuccessResponse)
async def cancel_task(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SuccessResponse:
    """
    Cancel a pending or running task.
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status in ("completed", "failed", "cancelled"):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel task with status '{task.status}'",
        )

    task.status = "cancelled"
    task.completed_at = datetime.now()

    await db.commit()

    logger.info("Task cancelled", task_id=task_id)

    return SuccessResponse(message=f"Task {task_id} cancelled successfully")


@router.post("/{task_id}/retry", response_model=TaskResponse)
async def retry_task(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TaskResponse:
    """
    Retry a failed task.
    """
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status != "failed":
        raise HTTPException(
            status_code=400,
            detail="Only failed tasks can be retried",
        )

    # Reset task state
    task.status = "pending"
    task.started_at = None
    task.completed_at = None
    task.errors = []
    task.current_phase = 0

    await db.commit()
    await db.refresh(task)

    logger.info("Task queued for retry", task_id=task_id)

    return TaskResponse(**task.to_dict(), executions=None)


@router.get("/{task_id}/executions", response_model=list[ExecutionResponse])
async def get_task_executions(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[ExecutionResponse]:
    """
    Get all executions for a task.
    """
    # Verify task exists
    task_result = await db.execute(select(Task.id).where(Task.id == task_id))
    if not task_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Task not found")

    result = await db.execute(
        select(Execution)
        .where(Execution.task_id == task_id)
        .order_by(Execution.phase_number, Execution.started_at)
    )
    executions = result.scalars().all()

    return [ExecutionResponse(**e.to_dict()) for e in executions]
