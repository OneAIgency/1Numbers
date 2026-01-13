"""
Orchestrator Service with LangChain/LangGraph integration
"""

from typing import Optional, List, Dict
from datetime import datetime
import uuid
import asyncio

from langchain_anthropic import ChatAnthropic
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, END
from pydantic import BaseModel

from services.cache import CacheService
from services.claude import ClaudeService
from services.ollama import OllamaService
from services.agents.implement_agent import ImplementAgent
from services.agents.verify_agent import VerifyAgent
from services.agents.test_agent import TestAgent
from api.websocket import connection_manager


class OrchestratorState(BaseModel):
    """State for LangGraph"""
    task_id: str = ""
    description: str = ""
    phases: List[Dict] = []
    current_phase: int = 0
    results: Dict = {}
    errors: List[str] = []
    status: str = "pending"  # pending, running, completed, failed


class OrchestratorService:
    _instance: Optional['OrchestratorService'] = None
    _tasks: Dict[str, Dict] = {}
    _workers: Dict[str, Dict] = {}

    def __init__(self, cache_service: CacheService, project_path: Optional[str] = None):
        self.cache_service = cache_service
        self.claude_service = ClaudeService()
        self.ollama_service = OllamaService()
        self.project_path = project_path
        self._graph = None
        self._initialized = False
        
        # Initialize agents
        self.implement_agent = ImplementAgent(self.claude_service, self.ollama_service)
        self.verify_agent = VerifyAgent(project_path)
        self.test_agent = TestAgent(project_path)

    @classmethod
    def get_instance(cls) -> 'OrchestratorService':
        if cls._instance is None:
            raise RuntimeError("OrchestratorService not initialized")
        return cls._instance

    async def initialize(self):
        """Initialize orchestrator"""
        if self._initialized:
            return
        
        # Build LangGraph workflow
        self._build_graph()
        
        OrchestratorService._instance = self
        self._initialized = True

    def _build_graph(self):
        """Build LangGraph workflow"""
        workflow = StateGraph(OrchestratorState)
        
        # Add nodes
        workflow.add_node("analyze", self._analyze_task)
        workflow.add_node("decompose", self._decompose_task)
        workflow.add_node("execute", self._execute_phase)
        workflow.add_node("verify", self._verify_phase)
        
        # Add edges
        workflow.set_entry_point("analyze")
        workflow.add_edge("analyze", "decompose")
        workflow.add_edge("decompose", "execute")
        
        # Conditional edge: continue to verify or back to execute for next phase
        workflow.add_conditional_edges(
            "execute",
            self._should_continue,
            {
                "continue": "execute",  # More phases to execute
                "verify": "verify"      # All phases done, verify
            }
        )
        
        workflow.add_edge("verify", END)
        
        self._graph = workflow.compile()
    
    def _should_continue(self, state: OrchestratorState) -> str:
        """Determine if we should continue to next phase or verify"""
        if state.current_phase < len(state.phases):
            return "continue"
        return "verify"

    async def _analyze_task(self, state: OrchestratorState):
        """Analyze task complexity"""
        # Use Claude to analyze task
        analysis = await self.claude_service.analyze_task(state.description)
        state.status = "running"
        return state

    async def _decompose_task(self, state: OrchestratorState):
        """Decompose task into phases"""
        # Use LangChain to decompose
        decomposition = await self.claude_service.decompose_task(state.description)
        state.phases = decomposition.get("phases", [])
        state.current_phase = 0
        return state

    async def _execute_phase(self, state: OrchestratorState):
        """Execute current phase"""
        if state.current_phase >= len(state.phases):
            state.status = "completed"
            return state
        
        phase = state.phases[state.current_phase]
        phase_results = []
        files_modified = []
        
        # Execute tasks in phase
        if phase.get("parallel", False):
            # Execute in parallel
            import asyncio
            tasks = [
                self._execute_task(task, state.task_id)
                for task in phase.get("tasks", [])
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for result in results:
                if isinstance(result, Exception):
                    state.errors.append(str(result))
                else:
                    phase_results.append(result)
                    if result.get("files_modified"):
                        files_modified.extend(result["files_modified"])
        else:
            # Execute sequentially
            for task in phase.get("tasks", []):
                try:
                    result = await self._execute_task(task, state.task_id)
                    phase_results.append(result)
                    if result.get("files_modified"):
                        files_modified.extend(result["files_modified"])
                except Exception as e:
                    state.errors.append(str(e))
        
        # Store phase results
        state.results[f"phase_{state.current_phase}"] = {
            "results": phase_results,
            "files_modified": files_modified
        }
        
        state.current_phase += 1
        
        # Broadcast progress update
        await self._broadcast_progress(state)
        
        return state
    
    async def _execute_task(self, task: Dict, task_id: str) -> Dict:
        """Execute a single task"""
        agent_type = task.get("agent", "implement")
        
        # Broadcast task start
        await connection_manager.broadcast({
            "type": "task_started",
            "task_id": task_id,
            "subtask_id": task.get("id"),
            "agent": agent_type
        })
        
        try:
            if agent_type == "implement":
                result = await self.implement_agent.execute(
                    task,
                    project_path=self.project_path,
                    model_preference=task.get("model")
                )
            elif agent_type == "verify":
                # Get files modified from previous tasks
                files_modified = task.get("files_modified", [])
                result = await self.verify_agent.execute(task, files_modified)
            elif agent_type == "test":
                result = await self.test_agent.execute(task, task.get("test_file"))
            else:
                result = {
                    "success": False,
                    "error": f"Unknown agent type: {agent_type}"
                }
            
            # Broadcast task completion
            await connection_manager.broadcast({
                "type": "task_completed",
                "task_id": task_id,
                "subtask_id": task.get("id"),
                "success": result.get("success", False)
            })
            
            return result
            
        except Exception as e:
            await connection_manager.broadcast({
                "type": "task_failed",
                "task_id": task_id,
                "subtask_id": task.get("id"),
                "error": str(e)
            })
            raise

    async def _verify_phase(self, state: OrchestratorState):
        """Verify phase completion"""
        # Get all files modified across all phases
        all_files_modified = []
        for i in range(state.current_phase):
            phase_key = f"phase_{i}"
            phase_data = state.results.get(phase_key, {})
            files = phase_data.get("files_modified", [])
            all_files_modified.extend(files)
        
        # Run final verification if files were modified
        if all_files_modified:
            verify_result = await self.verify_agent.execute(
                {"description": "Final verification"},
                all_files_modified
            )
            
            if not verify_result["success"]:
                state.errors.extend(verify_result.get("errors", []))
                # Don't fail completely, just add warnings
                if verify_result.get("warnings"):
                    state.errors.extend([f"Warning: {w}" for w in verify_result["warnings"]])
        
        state.status = "completed"
        return state
    
    async def _broadcast_progress(self, state: OrchestratorState):
        """Broadcast progress update via WebSocket"""
        total_phases = len(state.phases)
        progress = (state.current_phase / total_phases) * 100 if total_phases > 0 else 0
        
        await connection_manager.broadcast({
            "type": "task_progress",
            "task_id": state.task_id,
            "progress": progress,
            "current_phase": state.current_phase,
            "total_phases": total_phases,
            "status": state.status
        })

    async def create_task(
        self,
        description: str,
        project_id: Optional[str] = None,
        max_workers: int = 4,
        agent_preferences: Optional[Dict] = None
    ) -> str:
        """Create a new task"""
        task_id = str(uuid.uuid4())
        task = {
            "id": task_id,
            "description": description,
            "project_id": project_id,
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "max_workers": max_workers,
            "agent_preferences": agent_preferences or {},
            "phases": [],
            "progress": 0.0
        }
        self._tasks[task_id] = task
        return task_id

    async def execute_task(self, task_id: str):
        """Execute a task"""
        task = self._tasks.get(task_id)
        if not task:
            return
        
        task["status"] = "running"
        
        # Create state
        state = OrchestratorState()
        state.task_id = task_id
        state.description = task["description"]
        state.status = "running"
        
        # Run graph
        try:
            # Update task with initial state
            task["phases"] = []
            task["progress"] = 0.0
            
            # Broadcast task start
            await connection_manager.broadcast({
                "type": "task_started",
                "task_id": task_id,
                "description": task["description"]
            })
            
            # Run graph with progress updates
            result = await self._graph.ainvoke(state)
            
            # Update task with final results
            task["status"] = result.status
            task["results"] = result.results
            task["phases"] = result.phases
            task["progress"] = 100.0 if result.status == "completed" else 0.0
            
            # Broadcast completion
            await connection_manager.broadcast({
                "type": "task_completed",
                "task_id": task_id,
                "status": result.status,
                "errors": result.errors
            })
            
        except Exception as e:
            task["status"] = "failed"
            task["error"] = str(e)
            task["progress"] = 0.0
            
            await connection_manager.broadcast({
                "type": "task_failed",
                "task_id": task_id,
                "error": str(e)
            })

    async def get_task(self, task_id: str) -> Optional[Dict]:
        """Get task by ID"""
        return self._tasks.get(task_id)

    async def list_tasks(self, project_id: Optional[str] = None, limit: int = 50) -> List[Dict]:
        """List tasks"""
        tasks = list(self._tasks.values())
        if project_id:
            tasks = [t for t in tasks if t.get("project_id") == project_id]
        return tasks[:limit]

    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a task"""
        task = self._tasks.get(task_id)
        if task:
            task["status"] = "cancelled"
            return True
        return False

    async def get_system_stats(self) -> Dict:
        """Get system statistics"""
        return {
            "cpu_usage": 0.0,
            "memory_usage": 0.0,
            "active_workers": len(self._workers),
            "queued_tasks": len([t for t in self._tasks.values() if t["status"] == "pending"]),
            "cache_hits": 0,
            "cache_misses": 0
        }

    async def get_task_stats(self) -> Dict:
        """Get task statistics"""
        tasks = list(self._tasks.values())
        return {
            "total": len(tasks),
            "pending": len([t for t in tasks if t["status"] == "pending"]),
            "running": len([t for t in tasks if t["status"] == "running"]),
            "completed": len([t for t in tasks if t["status"] == "completed"]),
            "failed": len([t for t in tasks if t["status"] == "failed"])
        }

    async def get_workers(self) -> List[Dict]:
        """Get worker status"""
        return list(self._workers.values())

    def is_ready(self) -> bool:
        """Check if orchestrator is ready"""
        return self._initialized

    async def shutdown(self):
        """Shutdown orchestrator"""
        self._initialized = False

