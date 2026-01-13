"""
Project Repository

Database operations for projects.
"""

from typing import Sequence
from uuid import uuid4

from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.project import Project


class ProjectRepository:
    """Repository for project database operations"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        name: str,
        path: str,
        description: str | None = None,
        settings: dict | None = None,
    ) -> Project:
        """Create a new project"""
        project = Project(
            id=str(uuid4()),
            name=name,
            path=path,
            description=description,
            settings=settings or {},
        )
        self.session.add(project)
        await self.session.flush()
        return project

    async def get_by_id(self, project_id: str) -> Project | None:
        """Get a project by ID"""
        result = await self.session.execute(
            select(Project).where(Project.id == project_id)
        )
        return result.scalar_one_or_none()

    async def get_by_path(self, path: str) -> Project | None:
        """Get a project by path"""
        result = await self.session.execute(
            select(Project).where(Project.path == path)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[Sequence[Project], int]:
        """List projects with optional search"""
        # Count query
        count_query = select(func.count(Project.id))
        if search:
            count_query = count_query.where(
                Project.name.ilike(f"%{search}%")
            )
        count_result = await self.session.execute(count_query)
        total = count_result.scalar() or 0

        # Data query
        query = select(Project).order_by(Project.updated_at.desc())
        if search:
            query = query.where(Project.name.ilike(f"%{search}%"))
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(query)
        projects = result.scalars().all()

        return projects, total

    async def update(
        self,
        project_id: str,
        name: str | None = None,
        description: str | None = None,
        settings: dict | None = None,
    ) -> Project | None:
        """Update a project"""
        values: dict = {}
        if name is not None:
            values["name"] = name
        if description is not None:
            values["description"] = description
        if settings is not None:
            values["settings"] = settings

        if values:
            await self.session.execute(
                update(Project).where(Project.id == project_id).values(**values)
            )

        return await self.get_by_id(project_id)

    async def update_settings(
        self,
        project_id: str,
        settings: dict,
    ) -> Project | None:
        """Update project settings (merge with existing)"""
        project = await self.get_by_id(project_id)
        if project:
            merged_settings = {**project.settings, **settings}
            await self.session.execute(
                update(Project)
                .where(Project.id == project_id)
                .values(settings=merged_settings)
            )
        return await self.get_by_id(project_id)

    async def delete(self, project_id: str) -> bool:
        """Delete a project"""
        result = await self.session.execute(
            delete(Project).where(Project.id == project_id)
        )
        return result.rowcount > 0

    async def get_total_count(self) -> int:
        """Get total number of projects"""
        result = await self.session.execute(select(func.count(Project.id)))
        return result.scalar() or 0
