"""
Cost Tracking Model

Tracks API costs for AI providers.
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import String, Integer, DateTime, ForeignKey, func, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.connection import Base

if TYPE_CHECKING:
    from src.models.task import Task, Execution


class CostTracking(Base):
    """Cost tracking model for AI API usage"""

    __tablename__ = "cost_tracking"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        primary_key=True,
        default=lambda: str(uuid4()),
    )
    task_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("tasks.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    execution_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("executions.id", ondelete="SET NULL"),
        nullable=True,
    )

    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    operation: Mapped[str] = mapped_column(String(50), default="generate", nullable=False)

    tokens_input: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tokens_output: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cost_usd: Mapped[float] = mapped_column(DECIMAL(10, 6), nullable=False)

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Relationships
    task: Mapped["Task | None"] = relationship("Task", back_populates="cost_entries")

    def __repr__(self) -> str:
        return f"<CostTracking(id={self.id}, provider={self.provider}, cost=${self.cost_usd})>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "task_id": self.task_id,
            "execution_id": self.execution_id,
            "provider": self.provider,
            "model": self.model,
            "operation": self.operation,
            "tokens_input": self.tokens_input,
            "tokens_output": self.tokens_output,
            "cost_usd": float(self.cost_usd),
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
