"""
Mode Routes

Manage execution modes from admin panel.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

import structlog

from src.db.connection import get_db
from src.models.mode import ModeConfiguration
from src.models.task import Task
from src.api.schemas import (
    ModeConfigUpdate,
    ModeConfigResponse,
    ModeSwitchRequest,
    CurrentModeResponse,
    SuccessResponse,
    ExecutionMode,
)
from src.config import settings

logger = structlog.get_logger()
router = APIRouter(prefix="/modes", tags=["modes"])

# Default mode configurations
DEFAULT_MODE_CONFIGS = {
    "SPEED": {
        "decompositionDepth": "shallow",
        "parallelizationLevel": "aggressive",
        "validationDepth": "minimal",
        "requiresHumanApproval": False,
        "primaryModel": {"provider": "claude", "model": "claude-3-5-sonnet-20241022"},
        "fallbackModel": {"provider": "ollama", "model": "codellama:7b"},
        "requiredAgents": ["implement"],
        "optionalAgents": [],
        "taskTimeout": 300000,
        "maxRetries": 1,
    },
    "QUALITY": {
        "decompositionDepth": "deep",
        "parallelizationLevel": "balanced",
        "validationDepth": "comprehensive",
        "requiresHumanApproval": True,
        "primaryModel": {"provider": "claude", "model": "claude-opus-4-5-20251101"},
        "fallbackModel": {"provider": "claude", "model": "claude-3-5-sonnet-20241022"},
        "requiredAgents": ["concept", "architect", "implement", "test", "review", "docs"],
        "optionalAgents": ["security", "optimize"],
        "taskTimeout": 900000,
        "maxRetries": 3,
    },
    "AUTONOMY": {
        "decompositionDepth": "deep",
        "parallelizationLevel": "balanced",
        "validationDepth": "standard",
        "requiresHumanApproval": False,
        "primaryModel": {"provider": "claude", "model": "claude-opus-4-5-20251101"},
        "fallbackModel": {"provider": "claude", "model": "claude-3-5-sonnet-20241022"},
        "requiredAgents": ["concept", "architect", "implement", "test", "review", "docs", "deploy"],
        "optionalAgents": ["security", "optimize"],
        "taskTimeout": 1200000,
        "maxRetries": 3,
    },
    "COST": {
        "decompositionDepth": "shallow",
        "parallelizationLevel": "conservative",
        "validationDepth": "minimal",
        "requiresHumanApproval": False,
        "primaryModel": {"provider": "ollama", "model": "codellama:7b"},
        "fallbackModel": {"provider": "claude", "model": "claude-3-5-haiku-20241022"},
        "requiredAgents": ["implement", "test"],
        "optionalAgents": [],
        "taskTimeout": 600000,
        "maxRetries": 2,
        "costLimit": 1.0,
    },
}


async def ensure_default_modes(db: AsyncSession) -> None:
    """Ensure default mode configurations exist"""
    for mode, config in DEFAULT_MODE_CONFIGS.items():
        result = await db.execute(
            select(ModeConfiguration).where(ModeConfiguration.mode == mode)
        )
        if not result.scalar_one_or_none():
            mode_config = ModeConfiguration(
                mode=mode,
                config=config,
                is_active=True,
            )
            db.add(mode_config)
    await db.commit()


@router.get("", response_model=list[ModeConfigResponse])
async def list_modes(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[ModeConfigResponse]:
    """
    List all available execution modes.
    """
    await ensure_default_modes(db)

    result = await db.execute(select(ModeConfiguration).order_by(ModeConfiguration.mode))
    modes = result.scalars().all()

    return [ModeConfigResponse(**m.to_dict()) for m in modes]


@router.get("/current", response_model=CurrentModeResponse)
async def get_current_mode(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CurrentModeResponse:
    """
    Get the currently active mode.
    """
    current_mode = settings.default_mode

    # Get mode config
    result = await db.execute(
        select(ModeConfiguration).where(ModeConfiguration.mode == current_mode)
    )
    mode_config = result.scalar_one_or_none()

    if not mode_config:
        # Use default config
        config = DEFAULT_MODE_CONFIGS.get(current_mode, DEFAULT_MODE_CONFIGS["QUALITY"])
    else:
        config = mode_config.config

    # Count active tasks
    active_count = await db.execute(
        select(func.count()).select_from(Task).where(
            Task.status.in_(["pending", "running", "queued"])
        )
    )
    active_tasks = active_count.scalar() or 0

    return CurrentModeResponse(
        mode=current_mode,
        config=config,
        active_tasks=active_tasks,
    )


@router.post("/switch", response_model=SuccessResponse)
async def switch_mode(
    request: ModeSwitchRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SuccessResponse:
    """
    Switch to a different execution mode.

    Note: Active tasks will complete their current phase before using the new mode.
    """
    new_mode = request.mode.value

    # Verify mode exists
    result = await db.execute(
        select(ModeConfiguration).where(ModeConfiguration.mode == new_mode)
    )
    mode_config = result.scalar_one_or_none()

    if mode_config and not mode_config.is_active:
        raise HTTPException(
            status_code=400,
            detail=f"Mode '{new_mode}' is currently disabled",
        )

    # Count active tasks
    active_count = await db.execute(
        select(func.count()).select_from(Task).where(
            Task.status.in_(["running"])
        )
    )
    running_tasks = active_count.scalar() or 0

    # Note: In a real implementation, this would update a global state
    # For now, we log the change
    logger.info(
        "Mode switched",
        old_mode=settings.default_mode,
        new_mode=new_mode,
        running_tasks=running_tasks,
    )

    message = f"Switched to {new_mode} mode"
    if running_tasks > 0:
        message += f". {running_tasks} running tasks will complete their current phase first."

    return SuccessResponse(
        message=message,
        data={"mode": new_mode, "running_tasks": running_tasks},
    )


@router.get("/{mode}", response_model=ModeConfigResponse)
async def get_mode_config(
    mode: ExecutionMode,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ModeConfigResponse:
    """
    Get configuration for a specific mode.
    """
    result = await db.execute(
        select(ModeConfiguration).where(ModeConfiguration.mode == mode.value)
    )
    mode_config = result.scalar_one_or_none()

    if not mode_config:
        # Return default config
        default_config = DEFAULT_MODE_CONFIGS.get(mode.value)
        if not default_config:
            raise HTTPException(status_code=404, detail="Mode not found")

        return ModeConfigResponse(
            mode=mode.value,
            config=default_config,
            is_active=True,
            updated_at=None,
            updated_by=None,
        )

    return ModeConfigResponse(**mode_config.to_dict())


@router.put("/{mode}", response_model=ModeConfigResponse)
async def update_mode_config(
    mode: ExecutionMode,
    config_data: ModeConfigUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    updated_by: str = "admin",
) -> ModeConfigResponse:
    """
    Update configuration for a mode.

    This is an admin operation to customize mode behavior.
    """
    result = await db.execute(
        select(ModeConfiguration).where(ModeConfiguration.mode == mode.value)
    )
    mode_config = result.scalar_one_or_none()

    if not mode_config:
        # Create new config
        mode_config = ModeConfiguration(
            mode=mode.value,
            config=config_data.config,
            is_active=config_data.is_active,
            updated_by=updated_by,
        )
        db.add(mode_config)
    else:
        mode_config.config = config_data.config
        mode_config.is_active = config_data.is_active
        mode_config.updated_by = updated_by

    await db.commit()
    await db.refresh(mode_config)

    logger.info(
        "Mode configuration updated",
        mode=mode.value,
        updated_by=updated_by,
        is_active=config_data.is_active,
    )

    return ModeConfigResponse(**mode_config.to_dict())
