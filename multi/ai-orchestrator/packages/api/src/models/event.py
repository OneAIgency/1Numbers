"""
Event Model

Event sourcing model for audit trail and state reconstruction.
"""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import String, Integer, DateTime, func, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.db.connection import Base


class Event(Base):
    """Event model for event sourcing / audit trail"""

    __tablename__ = "events"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    aggregate_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        nullable=False,
        index=True,
    )
    aggregate_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    event_data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    event_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Unique constraint on aggregate_id + version
    __table_args__ = (
        # UniqueConstraint handled in migration
    )

    def __repr__(self) -> str:
        return f"<Event(id={self.id}, type={self.event_type}, version={self.version})>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "aggregate_id": self.aggregate_id,
            "aggregate_type": self.aggregate_type,
            "event_type": self.event_type,
            "event_data": self.event_data,
            "metadata": self.event_metadata,
            "version": self.version,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
