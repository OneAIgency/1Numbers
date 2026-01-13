"""
Mode Configuration Model

Stores configuration for each execution mode.
"""

from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.db.connection import Base


class ModeConfiguration(Base):
    """Mode configuration model for admin panel"""

    __tablename__ = "mode_configurations"

    mode: Mapped[str] = mapped_column(String(50), primary_key=True)
    config: Mapped[dict] = mapped_column(JSONB, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    updated_by: Mapped[str | None] = mapped_column(String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<ModeConfiguration(mode={self.mode}, active={self.is_active})>"

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            "mode": self.mode,
            "config": self.config,
            "is_active": self.is_active,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "updated_by": self.updated_by,
        }
