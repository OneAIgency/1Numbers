"""
Task Repository

Database operations for tasks and executions.
"""

from datetime import datetime
from typing import Sequence
from uuid import uuid4

from sqlalchemy import select, update, delete, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.task import Task, Execution


class TaskRepository:
    """Repository for task database operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        description: str,
        mode: str,
        project_id: str | None = None,
        priority: int = 0,
    ) -> Task:
        """Create a new task"""
        task = Task(
            id=str(uuid4()),
            description=description,
            mode=mode,
            project_id=project_id,
            priority=priority,
            status="pending",
            phases=[],
            results={},
            files_modified=[],
            errors=[],
        )
        self.session.add(task)
        await self.session.flush()
        return task

    async def get_by_id(self, task_id: str, include_executions: bool = False) -> Task | None:
        """Get a task by ID"""
        query = select(Task).where(Task.id == task_id)
        if include_executions:
            query = query.options(selectinload(Task.executions))
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list(
        self,
        status: str | None = None,
        mode: str | None = None,
        project_id: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[Sequence[Task], int]:
        """List tasks with filtering and pagination"""
        conditions = []
        if status:
            conditions.append(Task.status == status)
        if mode:
            conditions.append(Task.mode == mode)
        if project_id:
            conditions.append(Task.project_id == project_id)

        # Count query
        count_query = select(func.count(Task.id))
        if conditions:
            count_query = count_query.where(and_(*conditions))
        count_result = await self.session.execute(count_query)
        total = count_result.scalar() or 0

        # Data query
        query = select(Task).order_by(Task.created_at.desc())
        if conditions:
            query = query.where(and_(*conditions))
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(query)
        tasks = result.scalars().all()

        return tasks, total

    async def update_status(
        self,
        task_id: str,
        status: str,
        started_at: datetime | None = None,
        completed_at: datetime | None = None,
    ) -> Task | None:
        """Update task status"""
        values: dict = {"status": status}
        if started_at:
            values["started_at"] = started_at
        if completed_at:
            values["completed_at"] = completed_at

        await self.session.execute(
            update(Task).where(Task.id == task_id).values(**values)
        )
        return await self.get_by_id(task_id)

    async def update_phases(self, task_id: str, phases: list) -> Task | None:
        """Update task phases"""
        await self.session.execute(
            update(Task).where(Task.id == task_id).values(phases=phases)
        )
        return await self.get_by_id(task_id)

    async def update_current_phase(self, task_id: str, phase: int) -> Task | None:
        """Update current phase number"""
        await self.session.execute(
            update(Task).where(Task.id == task_id).values(current_phase=phase)
        )
        return await self.get_by_id(task_id)

    async def update_results(
        self,
        task_id: str,
        results: dict,
        files_modified: list[str] | None = None,
    ) -> Task | None:
        """Update task results"""
        values: dict = {"results": results}
        if files_modified is not None:
            values["files_modified"] = files_modified

        await self.session.execute(
            update(Task).where(Task.id == task_id).values(**values)
        )
        return await self.get_by_id(task_id)

    async def add_error(self, task_id: str, error_type: str, message: str) -> Task | None:
        """Add an error to the task"""
        task = await self.get_by_id(task_id)
        if task:
            errors = list(task.errors)
            errors.append({"type": error_type, "message": message})
            await self.session.execute(
                update(Task).where(Task.id == task_id).values(errors=errors)
            )
        return await self.get_by_id(task_id)

    async def update_cost(
        self,
        task_id: str,
        tokens_used: int,
        estimated_cost: float,
    ) -> Task | None:
        """Update task cost tracking"""
        await self.session.execute(
            update(Task)
            .where(Task.id == task_id)
            .values(tokens_used=tokens_used, estimated_cost=estimated_cost)
        )
        return await self.get_by_id(task_id)

    async def delete(self, task_id: str) -> bool:
        """Delete a task"""
        result = await self.session.execute(
            delete(Task).where(Task.id == task_id)
        )
        return result.rowcount > 0

    async def get_stats(self) -> dict:
        """Get task statistics"""
        total = await self.session.execute(select(func.count(Task.id)))
        completed = await self.session.execute(
            select(func.count(Task.id)).where(Task.status == "completed")
        )
        failed = await self.session.execute(
            select(func.count(Task.id)).where(Task.status == "failed")
        )
        running = await self.session.execute(
            select(func.count(Task.id)).where(Task.status == "running")
        )
        avg_duration = await self.session.execute(
            select(
                func.avg(
                    func.extract("epoch", Task.completed_at - Task.started_at) * 1000
                )
            ).where(Task.completed_at.isnot(None))
        )

        total_val = total.scalar() or 0
        completed_val = completed.scalar() or 0

        return {
            "total_tasks": total_val,
            "completed_tasks": completed_val,
            "failed_tasks": failed.scalar() or 0,
            "running_tasks": running.scalar() or 0,
            "avg_task_duration_ms": avg_duration.scalar(),
            "success_rate": (completed_val / total_val * 100) if total_val > 0 else 0,
        }

    # Execution operations
    async def create_execution(
        self,
        task_id: str,
        phase_number: int,
        agent_type: str,
    ) -> Execution:
        """Create a new execution"""
        execution = Execution(
            id=str(uuid4()),
            task_id=task_id,
            phase_number=phase_number,
            agent_type=agent_type,
            status="pending",
        )
        self.session.add(execution)
        await self.session.flush()
        return execution

    async def update_execution(
        self,
        execution_id: str,
        status: str | None = None,
        output: dict | None = None,
        error: str | None = None,
        model_used: str | None = None,
        tokens_input: int | None = None,
        tokens_output: int | None = None,
        cost: float | None = None,
        started_at: datetime | None = None,
        completed_at: datetime | None = None,
        duration_ms: int | None = None,
    ) -> Execution | None:
        """Update an execution"""
        values: dict = {}
        if status is not None:
            values["status"] = status
        if output is not None:
            values["output"] = output
        if error is not None:
            values["error"] = error
        if model_used is not None:
            values["model_used"] = model_used
        if tokens_input is not None:
            values["tokens_input"] = tokens_input
        if tokens_output is not None:
            values["tokens_output"] = tokens_output
        if cost is not None:
            values["cost"] = cost
        if started_at is not None:
            values["started_at"] = started_at
        if completed_at is not None:
            values["completed_at"] = completed_at
        if duration_ms is not None:
            values["duration_ms"] = duration_ms

        if values:
            await self.session.execute(
                update(Execution).where(Execution.id == execution_id).values(**values)
            )

        result = await self.session.execute(
            select(Execution).where(Execution.id == execution_id)
        )
        return result.scalar_one_or_none()

    async def get_executions_by_task(self, task_id: str) -> Sequence[Execution]:
        """Get all executions for a task"""
        result = await self.session.execute(
            select(Execution)
            .where(Execution.task_id == task_id)
            .order_by(Execution.phase_number, Execution.started_at)
        )
        return result.scalars().all()

    async def get_total_executions(self) -> int:
        """Get total number of executions"""
        result = await self.session.execute(select(func.count(Execution.id)))
        return result.scalar() or 0
