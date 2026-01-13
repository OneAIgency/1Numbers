"""
Project Routes

CRUD operations for projects.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

import structlog

from src.db.connection import get_db
from src.models.project import Project
from src.api.schemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    SuccessResponse,
)

logger = structlog.get_logger()
router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    project_data: ProjectCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProjectResponse:
    """
    Create a new project.
    """
    # Check for duplicate path
    existing = await db.execute(
        select(Project).where(Project.path == project_data.path)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="A project with this path already exists",
        )

    project = Project(
        name=project_data.name,
        path=project_data.path,
        description=project_data.description,
        settings=project_data.settings,
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    logger.info(
        "Project created",
        project_id=project.id,
        name=project.name,
        path=project.path,
    )

    return ProjectResponse(**project.to_dict())


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    db: Annotated[AsyncSession, Depends(get_db)],
    search: Annotated[str | None, Query()] = None,
) -> ProjectListResponse:
    """
    List all projects with optional search.
    """
    query = select(Project).order_by(Project.updated_at.desc())

    if search:
        query = query.where(
            Project.name.ilike(f"%{search}%") | Project.path.ilike(f"%{search}%")
        )

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    result = await db.execute(query)
    projects = result.scalars().all()

    return ProjectListResponse(
        projects=[ProjectResponse(**p.to_dict()) for p in projects],
        total=total,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProjectResponse:
    """
    Get a project by ID.
    """
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectResponse(**project.to_dict())


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProjectResponse:
    """
    Update a project.
    """
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project_data.name is not None:
        project.name = project_data.name

    if project_data.description is not None:
        project.description = project_data.description

    if project_data.settings is not None:
        # Merge settings
        project.settings = {**project.settings, **project_data.settings}

    await db.commit()
    await db.refresh(project)

    logger.info("Project updated", project_id=project_id)

    return ProjectResponse(**project.to_dict())


@router.delete("/{project_id}", response_model=SuccessResponse)
async def delete_project(
    project_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SuccessResponse:
    """
    Delete a project and all associated tasks.
    """
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()

    logger.info("Project deleted", project_id=project_id, name=project.name)

    return SuccessResponse(message=f"Project '{project.name}' deleted successfully")
