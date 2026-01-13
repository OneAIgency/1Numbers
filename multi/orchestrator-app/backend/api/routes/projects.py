"""
Project management routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
from pathlib import Path

router = APIRouter()

PROJECTS_DIR = Path(__file__).parent.parent.parent / "config" / "projects"
PROJECTS_DIR.mkdir(parents=True, exist_ok=True)


class ProjectSettings(BaseModel):
    name: str
    max_workers: int = 4
    preferred_model: str = "claude-3-opus"
    fallback_model: Optional[str] = "ollama:llama2"
    cache_enabled: bool = True
    cache_ttl: int = 3600
    agents: Optional[Dict[str, Dict]] = None


@router.post("/", response_model=ProjectSettings)
async def create_project(settings: ProjectSettings):
    """Create or update project settings"""
    try:
        project_file = PROJECTS_DIR / f"{settings.name}.json"
        with open(project_file, "w") as f:
            json.dump(settings.dict(), f, indent=2)
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_name}", response_model=ProjectSettings)
async def get_project(project_name: str):
    """Get project settings"""
    try:
        project_file = PROJECTS_DIR / f"{project_name}.json"
        if not project_file.exists():
            raise HTTPException(status_code=404, detail="Project not found")
        
        with open(project_file, "r") as f:
            return json.load(f)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[str])
async def list_projects():
    """List all projects"""
    try:
        projects = [f.stem for f in PROJECTS_DIR.glob("*.json")]
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{project_name}")
async def delete_project(project_name: str):
    """Delete project settings"""
    try:
        project_file = PROJECTS_DIR / f"{project_name}.json"
        if not project_file.exists():
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_file.unlink()
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

