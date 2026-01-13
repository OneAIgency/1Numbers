"""
Cost Repository

Database operations for cost tracking.
"""

from datetime import datetime, timedelta
from typing import Sequence
from uuid import uuid4

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.cost import CostTracking


class CostRepository:
    """Repository for cost tracking database operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        task_id: str,
        execution_id: str | None,
        provider: str,
        model: str,
        tokens_input: int,
        tokens_output: int,
        cost_usd: float,
    ) -> CostTracking:
        """Record a cost entry"""
        cost = CostTracking(
            id=str(uuid4()),
            task_id=task_id,
            execution_id=execution_id,
            provider=provider,
            model=model,
            tokens_input=tokens_input,
            tokens_output=tokens_output,
            cost_usd=cost_usd,
        )
        self.session.add(cost)
        await self.session.flush()
        return cost

    async def get_by_task(self, task_id: str) -> Sequence[CostTracking]:
        """Get all cost entries for a task"""
        result = await self.session.execute(
            select(CostTracking)
            .where(CostTracking.task_id == task_id)
            .order_by(CostTracking.timestamp.desc())
        )
        return result.scalars().all()

    async def get_total_by_task(self, task_id: str) -> float:
        """Get total cost for a task"""
        result = await self.session.execute(
            select(func.sum(CostTracking.cost_usd)).where(
                CostTracking.task_id == task_id
            )
        )
        return result.scalar() or 0.0

    async def get_stats(self, days: int = 7) -> dict:
        """Get cost statistics for the last N days"""
        since = datetime.utcnow() - timedelta(days=days)

        # Total cost
        total_result = await self.session.execute(
            select(func.sum(CostTracking.cost_usd)).where(
                CostTracking.timestamp >= since
            )
        )
        total_cost = total_result.scalar() or 0.0

        # Cost by provider
        provider_result = await self.session.execute(
            select(CostTracking.provider, func.sum(CostTracking.cost_usd))
            .where(CostTracking.timestamp >= since)
            .group_by(CostTracking.provider)
        )
        cost_by_provider = {row[0]: float(row[1]) for row in provider_result.all()}

        # Cost by model
        model_result = await self.session.execute(
            select(CostTracking.model, func.sum(CostTracking.cost_usd))
            .where(CostTracking.timestamp >= since)
            .group_by(CostTracking.model)
        )
        cost_by_model = {row[0]: float(row[1]) for row in model_result.all()}

        # Total tokens
        tokens_result = await self.session.execute(
            select(
                func.sum(CostTracking.tokens_input),
                func.sum(CostTracking.tokens_output),
            ).where(CostTracking.timestamp >= since)
        )
        tokens_row = tokens_result.one()

        return {
            "total_cost": float(total_cost),
            "cost_by_provider": cost_by_provider,
            "cost_by_model": cost_by_model,
            "total_tokens_input": tokens_row[0] or 0,
            "total_tokens_output": tokens_row[1] or 0,
            "period_start": since.isoformat(),
            "period_end": datetime.utcnow().isoformat(),
        }

    async def get_daily_costs(self, days: int = 30) -> list[dict]:
        """Get daily cost breakdown"""
        since = datetime.utcnow() - timedelta(days=days)

        result = await self.session.execute(
            select(
                func.date(CostTracking.timestamp).label("date"),
                func.sum(CostTracking.cost_usd).label("cost"),
                func.sum(CostTracking.tokens_input + CostTracking.tokens_output).label(
                    "tokens"
                ),
            )
            .where(CostTracking.timestamp >= since)
            .group_by(func.date(CostTracking.timestamp))
            .order_by(func.date(CostTracking.timestamp))
        )

        return [
            {
                "date": row.date.isoformat() if row.date else None,
                "cost": float(row.cost) if row.cost else 0.0,
                "tokens": int(row.tokens) if row.tokens else 0,
            }
            for row in result.all()
        ]

    async def get_provider_breakdown(self, days: int = 7) -> list[dict]:
        """Get cost breakdown by provider"""
        since = datetime.utcnow() - timedelta(days=days)

        result = await self.session.execute(
            select(
                CostTracking.provider,
                func.sum(CostTracking.cost_usd).label("cost"),
                func.sum(CostTracking.tokens_input).label("tokens_input"),
                func.sum(CostTracking.tokens_output).label("tokens_output"),
                func.count(CostTracking.id).label("count"),
            )
            .where(CostTracking.timestamp >= since)
            .group_by(CostTracking.provider)
        )

        return [
            {
                "provider": row.provider,
                "cost": float(row.cost) if row.cost else 0.0,
                "tokens_input": int(row.tokens_input) if row.tokens_input else 0,
                "tokens_output": int(row.tokens_output) if row.tokens_output else 0,
                "request_count": row.count,
            }
            for row in result.all()
        ]
