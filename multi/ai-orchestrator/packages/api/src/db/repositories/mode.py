"""
Mode Repository

Database operations for mode configurations.
"""

from datetime import datetime
from typing import Sequence

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.mode import ModeConfiguration


class ModeRepository:
    """Repository for mode configuration database operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_mode(self, mode: str) -> ModeConfiguration | None:
        """Get mode configuration by mode name"""
        result = await self.session.execute(
            select(ModeConfiguration).where(ModeConfiguration.mode == mode)
        )
        return result.scalar_one_or_none()

    async def list_all(self) -> Sequence[ModeConfiguration]:
        """List all mode configurations"""
        result = await self.session.execute(
            select(ModeConfiguration).order_by(ModeConfiguration.mode)
        )
        return result.scalars().all()

    async def get_active(self) -> ModeConfiguration | None:
        """Get the currently active mode configuration"""
        result = await self.session.execute(
            select(ModeConfiguration).where(ModeConfiguration.is_active == True)
        )
        return result.scalar_one_or_none()

    async def set_active(self, mode: str) -> ModeConfiguration | None:
        """Set a mode as active (deactivate others)"""
        # Deactivate all modes
        await self.session.execute(
            update(ModeConfiguration).values(is_active=False)
        )
        # Activate the specified mode
        await self.session.execute(
            update(ModeConfiguration)
            .where(ModeConfiguration.mode == mode)
            .values(is_active=True, updated_at=datetime.utcnow())
        )
        return await self.get_by_mode(mode)

    async def update_config(
        self,
        mode: str,
        config: dict,
        updated_by: str | None = None,
    ) -> ModeConfiguration | None:
        """Update mode configuration"""
        values: dict = {
            "config": config,
            "updated_at": datetime.utcnow(),
        }
        if updated_by:
            values["updated_by"] = updated_by

        await self.session.execute(
            update(ModeConfiguration)
            .where(ModeConfiguration.mode == mode)
            .values(**values)
        )
        return await self.get_by_mode(mode)

    async def upsert(
        self,
        mode: str,
        config: dict,
        is_active: bool = False,
        updated_by: str | None = None,
    ) -> ModeConfiguration:
        """Insert or update a mode configuration"""
        existing = await self.get_by_mode(mode)

        if existing:
            return await self.update_config(mode, config, updated_by)

        mode_config = ModeConfiguration(
            mode=mode,
            config=config,
            is_active=is_active,
            updated_by=updated_by,
        )
        self.session.add(mode_config)
        await self.session.flush()
        return mode_config

    async def initialize_defaults(self, default_configs: dict) -> None:
        """Initialize default mode configurations if they don't exist"""
        for mode, config in default_configs.items():
            existing = await self.get_by_mode(mode)
            if not existing:
                mode_config = ModeConfiguration(
                    mode=mode,
                    config=config,
                    is_active=(mode == "QUALITY"),  # QUALITY is default active
                )
                self.session.add(mode_config)
        await self.session.flush()
