"""
Event Repository

Database operations for event sourcing / audit trail.
"""

from datetime import datetime
from typing import Sequence

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.event import Event


class EventRepository:
    """Repository for event database operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        aggregate_id: str,
        aggregate_type: str,
        event_type: str,
        event_data: dict,
        metadata: dict | None = None,
    ) -> Event:
        """Create a new event"""
        # Get the next version for this aggregate
        version = await self._get_next_version(aggregate_id)

        event = Event(
            aggregate_id=aggregate_id,
            aggregate_type=aggregate_type,
            event_type=event_type,
            event_data=event_data,
            event_metadata=metadata or {},
            version=version,
        )
        self.session.add(event)
        await self.session.flush()
        return event

    async def _get_next_version(self, aggregate_id: str) -> int:
        """Get the next version number for an aggregate"""
        result = await self.session.execute(
            select(func.max(Event.version)).where(Event.aggregate_id == aggregate_id)
        )
        current_max = result.scalar()
        return (current_max or 0) + 1

    async def get_by_aggregate(
        self,
        aggregate_id: str,
        since_version: int | None = None,
    ) -> Sequence[Event]:
        """Get all events for an aggregate"""
        query = select(Event).where(Event.aggregate_id == aggregate_id)
        if since_version:
            query = query.where(Event.version > since_version)
        query = query.order_by(Event.version.asc())

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_type(
        self,
        event_type: str,
        since: datetime | None = None,
        limit: int = 100,
    ) -> Sequence[Event]:
        """Get events by type"""
        query = select(Event).where(Event.event_type == event_type)
        if since:
            query = query.where(Event.timestamp >= since)
        query = query.order_by(Event.timestamp.desc()).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_aggregate_type(
        self,
        aggregate_type: str,
        since: datetime | None = None,
        limit: int = 100,
    ) -> Sequence[Event]:
        """Get events by aggregate type"""
        query = select(Event).where(Event.aggregate_type == aggregate_type)
        if since:
            query = query.where(Event.timestamp >= since)
        query = query.order_by(Event.timestamp.desc()).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_recent(
        self,
        limit: int = 50,
        aggregate_type: str | None = None,
        event_types: list[str] | None = None,
    ) -> Sequence[Event]:
        """Get recent events with optional filtering"""
        conditions = []
        if aggregate_type:
            conditions.append(Event.aggregate_type == aggregate_type)
        if event_types:
            conditions.append(Event.event_type.in_(event_types))

        query = select(Event)
        if conditions:
            query = query.where(and_(*conditions))
        query = query.order_by(Event.timestamp.desc()).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def count_by_type(
        self,
        since: datetime | None = None,
    ) -> dict[str, int]:
        """Get event counts grouped by type"""
        query = select(Event.event_type, func.count(Event.id))
        if since:
            query = query.where(Event.timestamp >= since)
        query = query.group_by(Event.event_type)

        result = await self.session.execute(query)
        return {row[0]: row[1] for row in result.all()}

    async def get_total_count(self) -> int:
        """Get total number of events"""
        result = await self.session.execute(select(func.count(Event.id)))
        return result.scalar() or 0
