"""
Orchestrator State

State definitions for LangGraph workflow.
"""

from datetime import datetime
from enum import Enum
from typing import Any, TypedDict


class TaskStatus(str, Enum):
    """Task execution status"""
    PENDING = "pending"
    DECOMPOSING = "decomposing"
    QUEUED = "queued"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PhaseStatus(str, Enum):
    """Phase execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class AgentExecution(TypedDict, total=False):
    """Represents a single agent execution"""
    agent_type: str
    status: str
    input: dict[str, Any]
    output: dict[str, Any] | None
    error: str | None
    model_used: str | None
    tokens_input: int
    tokens_output: int
    cost: float
    started_at: str | None
    completed_at: str | None
    duration_ms: int | None


class PhaseState(TypedDict, total=False):
    """Represents a phase in task execution"""
    number: int
    name: str
    description: str
    status: str
    parallel: bool
    agents: list[str]
    executions: list[AgentExecution]
    started_at: str | None
    completed_at: str | None


class TaskState(TypedDict, total=False):
    """Complete task state for LangGraph"""
    task_id: str
    description: str
    project_id: str | None
    mode: str
    status: str
    priority: int

    # Decomposition
    phases: list[PhaseState]
    current_phase: int

    # Results
    results: dict[str, Any]
    files_modified: list[str]
    errors: list[dict[str, Any]]

    # Cost tracking
    tokens_used: int
    estimated_cost: float

    # Timestamps
    created_at: str
    started_at: str | None
    completed_at: str | None

    # Mode config (cached for the task)
    mode_config: dict[str, Any]


class OrchestratorState(TypedDict, total=False):
    """Global orchestrator state"""
    current_mode: str
    mode_config: dict[str, Any]
    active_tasks: dict[str, TaskState]
    task_queue: list[str]  # Task IDs in priority order
    stats: dict[str, Any]


def create_initial_task_state(
    task_id: str,
    description: str,
    mode: str,
    mode_config: dict[str, Any],
    project_id: str | None = None,
    priority: int = 0,
) -> TaskState:
    """Create initial state for a new task"""
    return TaskState(
        task_id=task_id,
        description=description,
        project_id=project_id,
        mode=mode,
        status=TaskStatus.PENDING.value,
        priority=priority,
        phases=[],
        current_phase=0,
        results={},
        files_modified=[],
        errors=[],
        tokens_used=0,
        estimated_cost=0.0,
        created_at=datetime.utcnow().isoformat(),
        started_at=None,
        completed_at=None,
        mode_config=mode_config,
    )


def create_phase_state(
    number: int,
    name: str,
    description: str,
    agents: list[str],
    parallel: bool = False,
) -> PhaseState:
    """Create a phase state"""
    return PhaseState(
        number=number,
        name=name,
        description=description,
        status=PhaseStatus.PENDING.value,
        parallel=parallel,
        agents=agents,
        executions=[],
        started_at=None,
        completed_at=None,
    )


def create_agent_execution(agent_type: str) -> AgentExecution:
    """Create an agent execution record"""
    return AgentExecution(
        agent_type=agent_type,
        status="pending",
        input={},
        output=None,
        error=None,
        model_used=None,
        tokens_input=0,
        tokens_output=0,
        cost=0.0,
        started_at=None,
        completed_at=None,
        duration_ms=None,
    )
