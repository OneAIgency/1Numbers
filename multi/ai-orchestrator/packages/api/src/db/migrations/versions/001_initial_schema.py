"""Initial schema

Revision ID: 001
Revises:
Create Date: 2025-01-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Projects table
    op.create_table(
        "projects",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, index=True),
        sa.Column("path", sa.Text, nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("settings", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # Tasks table
    op.create_table(
        "tasks",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column(
            "project_id",
            postgresql.UUID(as_uuid=False),
            sa.ForeignKey("projects.id", ondelete="SET NULL"),
            nullable=True,
            index=True,
        ),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column(
            "status", sa.String(50), nullable=False, server_default="pending", index=True
        ),
        sa.Column("mode", sa.String(50), nullable=False, server_default="QUALITY"),
        sa.Column("priority", sa.Integer, nullable=False, server_default="0"),
        sa.Column("phases", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("current_phase", sa.Integer, nullable=False, server_default="0"),
        sa.Column("results", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column(
            "files_modified", postgresql.ARRAY(sa.Text), nullable=False, server_default="{}"
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            index=True,
        ),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("tokens_used", sa.Integer, nullable=False, server_default="0"),
        sa.Column(
            "estimated_cost", sa.DECIMAL(10, 4), nullable=False, server_default="0"
        ),
        sa.Column("errors", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.CheckConstraint(
            "status IN ('pending', 'analyzing', 'running', 'paused', 'completed', 'failed', 'cancelled')",
            name="valid_task_status",
        ),
    )

    # Executions table
    op.create_table(
        "executions",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column(
            "task_id",
            postgresql.UUID(as_uuid=False),
            sa.ForeignKey("tasks.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("phase_number", sa.Integer, nullable=False),
        sa.Column("agent_type", sa.String(50), nullable=False, index=True),
        sa.Column(
            "status", sa.String(50), nullable=False, server_default="pending"
        ),
        sa.Column("input", postgresql.JSONB, nullable=True),
        sa.Column("output", postgresql.JSONB, nullable=True),
        sa.Column("error", sa.Text, nullable=True),
        sa.Column("model_used", sa.String(100), nullable=True),
        sa.Column("tokens_input", sa.Integer, nullable=False, server_default="0"),
        sa.Column("tokens_output", sa.Integer, nullable=False, server_default="0"),
        sa.Column("cost", sa.DECIMAL(10, 6), nullable=False, server_default="0"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("duration_ms", sa.Integer, nullable=True),
    )

    # Events table (event sourcing)
    op.create_table(
        "events",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column(
            "aggregate_id", postgresql.UUID(as_uuid=False), nullable=False, index=True
        ),
        sa.Column("aggregate_type", sa.String(50), nullable=False, index=True),
        sa.Column("event_type", sa.String(100), nullable=False, index=True),
        sa.Column("event_data", postgresql.JSONB, nullable=False),
        sa.Column("metadata", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("version", sa.Integer, nullable=False),
        sa.Column(
            "timestamp",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            index=True,
        ),
        sa.UniqueConstraint("aggregate_id", "version", name="uq_events_aggregate_version"),
    )

    # Cost tracking table
    op.create_table(
        "cost_tracking",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column(
            "task_id",
            postgresql.UUID(as_uuid=False),
            sa.ForeignKey("tasks.id", ondelete="SET NULL"),
            nullable=True,
            index=True,
        ),
        sa.Column(
            "execution_id",
            postgresql.UUID(as_uuid=False),
            sa.ForeignKey("executions.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("provider", sa.String(50), nullable=False, index=True),
        sa.Column("model", sa.String(100), nullable=False),
        sa.Column("operation", sa.String(50), nullable=False, server_default="generate"),
        sa.Column("tokens_input", sa.Integer, nullable=False, server_default="0"),
        sa.Column("tokens_output", sa.Integer, nullable=False, server_default="0"),
        sa.Column("cost_usd", sa.DECIMAL(10, 6), nullable=False),
        sa.Column(
            "timestamp",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            index=True,
        ),
    )

    # Mode configurations table
    op.create_table(
        "mode_configurations",
        sa.Column("mode", sa.String(50), primary_key=True),
        sa.Column("config", postgresql.JSONB, nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("updated_by", sa.String(255), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("mode_configurations")
    op.drop_table("cost_tracking")
    op.drop_table("events")
    op.drop_table("executions")
    op.drop_table("tasks")
    op.drop_table("projects")
