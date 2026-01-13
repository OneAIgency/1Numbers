"""
Task and Execution Models

Represents tasks and their individual agent executions.
"""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, func, DECIMAL, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.connection import Base

if TYPE_CHECKING:
    from src.models.project import Project
    from src.models.cost import CostTracking


class Task(Base):
    """Task model for storing orchestration tasks"""

    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        primary_key=True,
        default=lambda: str(uuid4()),
    )
    project_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        nullable=False,
        index=True,
    )
    mode: Mapped[str] = mapped_column(String(50), nullable=False, default="QUALITY")
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Decomposition
    phases: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)
    current_phase: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Results
    results: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    files_modified: Mapped[list] = mapped_column(ARRAY(Text), default=list, nullable=False)

    # Metadata
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Cost tracking
    tokens_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    estimated_cost: Mapped[float] = mapped_column(
        DECIMAL(10, 4),
        default=0,
        nullable=False,
    )

    # Error info
    errors: Mapped[list] = mapped_column(JSONB, default=list, nullable=False)

    # Relationships
    project: Mapped["Project | None"] = relationship("Project", back_populates="tasks")
    executions: Mapped[list["Execution"]] = relationship(
        "Execution",
        back_populates="task",
        cascade="all, delete-orphan",
    )
    cost_entries: Mapped[list["CostTracking"]] = relationship(
        "CostTracking",
        back_populates="task",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, status={self.status})>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "description": self.description,
            "status": self.status,
            "mode": self.mode,
            "priority": self.priority,
            "phases": self.phases,
            "current_phase": self.current_phase,
            "results": self.results,
            "files_modified": self.files_modified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "tokens_used": self.tokens_used,
            "estimated_cost": float(self.estimated_cost),
            "errors": self.errors,
        }


class Execution(Base):
    """Execution model for storing individual agent executions"""

    __tablename__ = "executions"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        primary_key=True,
        default=lambda: str(uuid4()),
    )
    task_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    phase_number: Mapped[int] = mapped_column(Integer, nullable=False)
    agent_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
    input: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    output: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)

    # AI usage
    model_used: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tokens_input: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tokens_output: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cost: Mapped[float] = mapped_column(DECIMAL(10, 6), default=0, nullable=False)

    # Timing
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Relationships
    task: Mapped["Task"] = relationship("Task", back_populates="executions")

    def __repr__(self) -> str:
        return f"<Execution(id={self.id}, agent={self.agent_type}, status={self.status})>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "task_id": self.task_id,
            "phase_number": self.phase_number,
            "agent_type": self.agent_type,
            "status": self.status,
            "input": self.input,
            "output": self.output,
            "error": self.error,
            "model_used": self.model_used,
            "tokens_input": self.tokens_input,
            "tokens_output": self.tokens_output,
            "cost": float(self.cost),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "duration_ms": self.duration_ms,
        }
