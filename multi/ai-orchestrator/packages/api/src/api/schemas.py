"""
API Schemas

Pydantic models for request/response validation.
"""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


# Enums
class ExecutionMode(str, Enum):
    SPEED = "SPEED"
    QUALITY = "QUALITY"
    AUTONOMY = "AUTONOMY"
    COST = "COST"


class TaskStatus(str, Enum):
    PENDING = "pending"
    QUEUED = "queued"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AgentType(str, Enum):
    CONCEPT = "concept"
    ARCHITECT = "architect"
    IMPLEMENT = "implement"
    TEST = "test"
    REVIEW = "review"
    OPTIMIZE = "optimize"
    DOCS = "docs"
    DEPLOY = "deploy"
    SECURITY = "security"
    REFACTOR = "refactor"
    DEBUG = "debug"
    MIGRATE = "migrate"


# Task Schemas
class TaskCreate(BaseModel):
    """Schema for creating a task"""

    description: str = Field(..., min_length=1, description="Task description")
    project_id: str | None = Field(None, description="Optional project ID")
    mode: ExecutionMode = Field(default=ExecutionMode.QUALITY, description="Execution mode")
    priority: int = Field(default=0, ge=0, le=100, description="Task priority (0-100)")


class TaskUpdate(BaseModel):
    """Schema for updating a task"""

    status: TaskStatus | None = None
    priority: int | None = Field(None, ge=0, le=100)


class ExecutionResponse(BaseModel):
    """Schema for execution response"""

    id: str
    task_id: str
    phase_number: int
    agent_type: str
    status: str
    input: dict | None
    output: dict | None
    error: str | None
    model_used: str | None
    tokens_input: int
    tokens_output: int
    cost: float
    started_at: datetime | None
    completed_at: datetime | None
    duration_ms: int | None

    model_config = {"from_attributes": True}


class TaskResponse(BaseModel):
    """Schema for task response"""

    id: str
    project_id: str | None
    description: str
    status: str
    mode: str
    priority: int
    phases: list[dict]
    current_phase: int
    results: dict
    files_modified: list[str]
    created_at: datetime
    started_at: datetime | None
    completed_at: datetime | None
    tokens_used: int
    estimated_cost: float
    errors: list[dict]
    executions: list[ExecutionResponse] | None = None

    model_config = {"from_attributes": True}


class TaskListResponse(BaseModel):
    """Schema for task list response"""

    tasks: list[TaskResponse]
    total: int
    page: int
    page_size: int


# Project Schemas
class ProjectCreate(BaseModel):
    """Schema for creating a project"""

    name: str = Field(..., min_length=1, max_length=255)
    path: str = Field(..., min_length=1)
    description: str | None = None
    settings: dict[str, Any] = Field(default_factory=dict)


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""

    name: str | None = Field(None, max_length=255)
    description: str | None = None
    settings: dict[str, Any] | None = None


class ProjectResponse(BaseModel):
    """Schema for project response"""

    id: str
    name: str
    path: str
    description: str | None
    settings: dict
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    """Schema for project list response"""

    projects: list[ProjectResponse]
    total: int


# Mode Schemas
class ModeConfigUpdate(BaseModel):
    """Schema for updating mode configuration"""

    config: dict[str, Any]
    is_active: bool = True


class ModeConfigResponse(BaseModel):
    """Schema for mode configuration response"""

    mode: str
    config: dict
    is_active: bool
    updated_at: datetime
    updated_by: str | None

    model_config = {"from_attributes": True}


class ModeSwitchRequest(BaseModel):
    """Schema for switching modes"""

    mode: ExecutionMode


class CurrentModeResponse(BaseModel):
    """Schema for current mode response"""

    mode: str
    config: dict
    active_tasks: int


# Agent Schemas
class AgentInfo(BaseModel):
    """Schema for agent information"""

    type: str
    name: str
    description: str
    capabilities: list[str]
    dependencies: list[str]
    supported_modes: list[str]


class AgentListResponse(BaseModel):
    """Schema for agent list response"""

    agents: list[AgentInfo]


# Monitoring Schemas
class SystemStats(BaseModel):
    """Schema for system statistics"""

    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    running_tasks: int
    total_executions: int
    avg_task_duration_ms: float | None
    success_rate: float


class CostStats(BaseModel):
    """Schema for cost statistics"""

    total_cost: float
    cost_by_provider: dict[str, float]
    cost_by_model: dict[str, float]
    total_tokens_input: int
    total_tokens_output: int
    period_start: datetime
    period_end: datetime


class HealthResponse(BaseModel):
    """Schema for health check response"""

    status: str
    version: str
    database: dict
    cache: dict
    claude: dict
    ollama: dict


# Generic responses
class ErrorResponse(BaseModel):
    """Schema for error response"""

    error: str
    detail: str | None = None
    code: str | None = None


class SuccessResponse(BaseModel):
    """Schema for success response"""

    message: str
    data: dict | None = None
