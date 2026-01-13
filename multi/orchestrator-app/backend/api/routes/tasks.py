"""
Task management routes
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from services.orchestrator import OrchestratorService
from api.websocket import connection_manager

router = APIRouter()


class TaskCreate(BaseModel):
    description: str
    project_id: Optional[str] = None
    max_workers: Optional[int] = 4
    agent_preferences: Optional[dict] = None


class TaskResponse(BaseModel):
    id: str
    description: str
    status: str
    created_at: datetime
    phases: List[dict]
    progress: float


@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, background_tasks: BackgroundTasks):
    """Create a new task"""
    try:
        orchestrator = OrchestratorService.get_instance()
        task_id = await orchestrator.create_task(
            description=task.description,
            project_id=task.project_id,
            max_workers=task.max_workers,
            agent_preferences=task.agent_preferences
        )
        
        # Start execution in background
        background_tasks.add_task(
            orchestrator.execute_task,
            task_id
        )
        
        # Notify via WebSocket
        await connection_manager.broadcast({
            "type": "task_created",
            "task_id": task_id,
            "description": task.description
        })
        
        return {
            "id": task_id,
            "description": task.description,
            "status": "pending",
            "created_at": datetime.now(),
            "phases": [],
            "progress": 0.0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Get task status"""
    try:
        orchestrator = OrchestratorService.get_instance()
        task = await orchestrator.get_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(project_id: Optional[str] = None, limit: int = 50):
    """List all tasks"""
    try:
        orchestrator = OrchestratorService.get_instance()
        tasks = await orchestrator.list_tasks(project_id=project_id, limit=limit)
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{task_id}")
async def cancel_task(task_id: str):
    """Cancel a running task"""
    try:
        orchestrator = OrchestratorService.get_instance()
        success = await orchestrator.cancel_task(task_id)
        if not success:
            raise HTTPException(status_code=404, detail="Task not found")
        
        await connection_manager.broadcast({
            "type": "task_cancelled",
            "task_id": task_id
        })
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

