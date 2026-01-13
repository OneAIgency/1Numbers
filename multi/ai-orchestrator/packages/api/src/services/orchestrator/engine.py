"""
Orchestrator Engine

Core orchestration engine using LangGraph for workflow management.
"""

import asyncio
from datetime import datetime
from typing import Any, Callable
from uuid import uuid4

import structlog

from src.config import settings
from src.services.orchestrator.state import (
    TaskState,
    TaskStatus,
    PhaseStatus,
    create_initial_task_state,
    create_phase_state,
    create_agent_execution,
)
from src.services.providers.claude import get_claude
from src.services.providers.ollama import get_ollama
from src.api.websocket import get_manager

logger = structlog.get_logger()


# Mode configurations
MODE_CONFIGS = {
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


class OrchestratorEngine:
    """
    Core orchestration engine.

    Manages task lifecycle, agent coordination, and state transitions.
    """

    def __init__(self) -> None:
        self._current_mode = settings.default_mode
        self._active_tasks: dict[str, TaskState] = {}
        self._task_queue: list[str] = []
        self._workers: dict[str, asyncio.Task] = {}
        self._max_workers = settings.max_workers
        self._running = False
        self._event_handlers: dict[str, list[Callable]] = {}

    @property
    def current_mode(self) -> str:
        """Get current execution mode"""
        return self._current_mode

    @property
    def mode_config(self) -> dict[str, Any]:
        """Get current mode configuration"""
        return MODE_CONFIGS.get(self._current_mode, MODE_CONFIGS["QUALITY"])

    async def start(self) -> None:
        """Start the orchestrator"""
        self._running = True
        logger.info("Orchestrator started", mode=self._current_mode)

    async def stop(self) -> None:
        """Stop the orchestrator"""
        self._running = False

        # Cancel all running workers
        for task_id, worker in self._workers.items():
            worker.cancel()
            try:
                await worker
            except asyncio.CancelledError:
                pass

        self._workers.clear()
        logger.info("Orchestrator stopped")

    async def switch_mode(self, new_mode: str) -> dict[str, Any]:
        """
        Switch execution mode.

        Active tasks will complete their current phase before using the new mode.
        """
        if new_mode not in MODE_CONFIGS:
            raise ValueError(f"Unknown mode: {new_mode}")

        old_mode = self._current_mode
        self._current_mode = new_mode

        # Notify via WebSocket
        manager = get_manager()
        await manager.send_mode_change(old_mode, new_mode, MODE_CONFIGS[new_mode])

        logger.info(
            "Mode switched",
            old_mode=old_mode,
            new_mode=new_mode,
            active_tasks=len(self._active_tasks),
        )

        return {
            "old_mode": old_mode,
            "new_mode": new_mode,
            "active_tasks": len(self._active_tasks),
        }

    async def submit_task(
        self,
        task_id: str,
        description: str,
        mode: str | None = None,
        project_id: str | None = None,
        priority: int = 0,
    ) -> TaskState:
        """
        Submit a new task for execution.
        """
        mode = mode or self._current_mode
        mode_config = MODE_CONFIGS.get(mode, MODE_CONFIGS["QUALITY"])

        # Create initial state
        state = create_initial_task_state(
            task_id=task_id,
            description=description,
            mode=mode,
            mode_config=mode_config,
            project_id=project_id,
            priority=priority,
        )

        self._active_tasks[task_id] = state

        # Add to queue (sorted by priority)
        self._task_queue.append(task_id)
        self._task_queue.sort(key=lambda tid: self._active_tasks[tid]["priority"], reverse=True)

        logger.info(
            "Task submitted",
            task_id=task_id,
            mode=mode,
            priority=priority,
            queue_position=self._task_queue.index(task_id),
        )

        # Emit event
        await self._emit_event("task_submitted", state)

        # Start processing if not already running
        if self._running:
            asyncio.create_task(self._process_queue())

        return state

    async def get_task_state(self, task_id: str) -> TaskState | None:
        """Get current state of a task"""
        return self._active_tasks.get(task_id)

    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a task"""
        if task_id not in self._active_tasks:
            return False

        state = self._active_tasks[task_id]
        if state["status"] in [TaskStatus.COMPLETED.value, TaskStatus.FAILED.value]:
            return False

        # Cancel worker if running
        if task_id in self._workers:
            self._workers[task_id].cancel()
            try:
                await self._workers[task_id]
            except asyncio.CancelledError:
                pass
            del self._workers[task_id]

        # Update state
        state["status"] = TaskStatus.CANCELLED.value
        state["completed_at"] = datetime.utcnow().isoformat()

        # Remove from queue
        if task_id in self._task_queue:
            self._task_queue.remove(task_id)

        await self._emit_event("task_cancelled", state)

        logger.info("Task cancelled", task_id=task_id)
        return True

    async def _process_queue(self) -> None:
        """Process tasks from the queue"""
        while self._running and self._task_queue:
            # Check if we can start more workers
            if len(self._workers) >= self._max_workers:
                await asyncio.sleep(0.5)
                continue

            # Get next task
            task_id = self._task_queue[0]
            state = self._active_tasks.get(task_id)

            if not state or state["status"] != TaskStatus.PENDING.value:
                self._task_queue.pop(0)
                continue

            # Start worker
            worker = asyncio.create_task(self._execute_task(task_id))
            self._workers[task_id] = worker
            self._task_queue.pop(0)

            logger.info("Task worker started", task_id=task_id)

    async def _execute_task(self, task_id: str) -> None:
        """Execute a task through all phases"""
        state = self._active_tasks.get(task_id)
        if not state:
            return

        try:
            # Update status
            state["status"] = TaskStatus.DECOMPOSING.value
            state["started_at"] = datetime.utcnow().isoformat()
            await self._emit_event("task_started", state)

            # Decompose task into phases
            await self._decompose_task(state)

            # Update status
            state["status"] = TaskStatus.RUNNING.value
            await self._emit_event("task_decomposed", state)

            # Execute phases
            for phase_idx, phase in enumerate(state["phases"]):
                state["current_phase"] = phase_idx
                await self._execute_phase(state, phase)

                # Check for failure
                if phase["status"] == PhaseStatus.FAILED.value:
                    state["status"] = TaskStatus.FAILED.value
                    break

            # Mark complete if all phases succeeded
            if state["status"] == TaskStatus.RUNNING.value:
                state["status"] = TaskStatus.COMPLETED.value
                state["completed_at"] = datetime.utcnow().isoformat()

            await self._emit_event("task_completed", state)

        except asyncio.CancelledError:
            logger.info("Task execution cancelled", task_id=task_id)
            raise

        except Exception as e:
            state["status"] = TaskStatus.FAILED.value
            state["completed_at"] = datetime.utcnow().isoformat()
            state["errors"].append({
                "type": "execution_error",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            })

            logger.error("Task execution failed", task_id=task_id, error=str(e))
            await self._emit_event("task_failed", state)

        finally:
            # Cleanup
            if task_id in self._workers:
                del self._workers[task_id]

    async def _decompose_task(self, state: TaskState) -> None:
        """Decompose task into phases based on mode"""
        mode_config = state["mode_config"]
        required_agents = mode_config.get("requiredAgents", ["implement"])

        # Create phases based on agents
        phases = []

        # Group agents into phases
        if mode_config.get("decompositionDepth") == "shallow":
            # Single phase with all agents
            phases.append(create_phase_state(
                number=1,
                name="Execution",
                description="Execute all agents",
                agents=required_agents,
                parallel=mode_config.get("parallelizationLevel") == "aggressive",
            ))
        else:
            # Multiple phases
            phase_groups = [
                (["concept"], "Concept", "Analyze requirements"),
                (["architect"], "Architecture", "Design system architecture"),
                (["implement"], "Implementation", "Generate code"),
                (["test"], "Testing", "Create and run tests"),
                (["review", "security"], "Review", "Code review and security audit"),
                (["optimize"], "Optimization", "Performance optimization"),
                (["docs"], "Documentation", "Generate documentation"),
                (["deploy"], "Deployment", "Deploy changes"),
            ]

            phase_num = 1
            for agents, name, description in phase_groups:
                # Only include agents that are required
                phase_agents = [a for a in agents if a in required_agents]
                if phase_agents:
                    phases.append(create_phase_state(
                        number=phase_num,
                        name=name,
                        description=description,
                        agents=phase_agents,
                        parallel=len(phase_agents) > 1,
                    ))
                    phase_num += 1

        state["phases"] = phases

        logger.info(
            "Task decomposed",
            task_id=state["task_id"],
            phases=len(phases),
            agents=required_agents,
        )

    async def _execute_phase(self, state: TaskState, phase: dict) -> None:
        """Execute a single phase"""
        phase["status"] = PhaseStatus.RUNNING.value
        phase["started_at"] = datetime.utcnow().isoformat()

        await self._emit_event("phase_started", {
            "task_id": state["task_id"],
            "phase": phase,
        })

        try:
            agents = phase.get("agents", [])

            if phase.get("parallel") and len(agents) > 1:
                # Execute agents in parallel
                tasks = [
                    self._execute_agent(state, phase, agent_type)
                    for agent_type in agents
                ]
                await asyncio.gather(*tasks)
            else:
                # Execute agents sequentially
                for agent_type in agents:
                    await self._execute_agent(state, phase, agent_type)

                    # Check for failure
                    last_execution = phase["executions"][-1] if phase["executions"] else None
                    if last_execution and last_execution.get("status") == "failed":
                        break

            # Determine phase status
            failed = any(e.get("status") == "failed" for e in phase.get("executions", []))
            phase["status"] = PhaseStatus.FAILED.value if failed else PhaseStatus.COMPLETED.value

        except Exception as e:
            phase["status"] = PhaseStatus.FAILED.value
            state["errors"].append({
                "type": "phase_error",
                "phase": phase["number"],
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            })

        finally:
            phase["completed_at"] = datetime.utcnow().isoformat()
            await self._emit_event("phase_completed", {
                "task_id": state["task_id"],
                "phase": phase,
            })

    async def _execute_agent(
        self,
        state: TaskState,
        phase: dict,
        agent_type: str,
    ) -> None:
        """Execute a single agent"""
        execution = create_agent_execution(agent_type)
        execution["started_at"] = datetime.utcnow().isoformat()
        execution["status"] = "running"

        phase["executions"].append(execution)

        await self._emit_event("agent_started", {
            "task_id": state["task_id"],
            "phase": phase["number"],
            "agent": agent_type,
        })

        try:
            # Get AI provider
            mode_config = state["mode_config"]
            primary_model = mode_config.get("primaryModel", {})
            provider = primary_model.get("provider", "claude")
            model = primary_model.get("model")

            # Build prompt based on agent type
            prompt = self._build_agent_prompt(state, agent_type)

            # Execute via AI provider
            if provider == "claude":
                claude = await get_claude()
                result = await claude.generate(
                    prompt,
                    model=model,
                    temperature=0.7,
                    max_tokens=4096,
                )
            else:
                ollama = await get_ollama()
                result = await ollama.generate(
                    prompt,
                    model=model,
                    temperature=0.7,
                    max_tokens=4096,
                )

            # Update execution
            execution["status"] = "completed"
            execution["output"] = {"response": result.get("content", "")}
            execution["model_used"] = result.get("model")
            execution["tokens_input"] = result.get("tokens_input", 0)
            execution["tokens_output"] = result.get("tokens_output", 0)
            execution["cost"] = result.get("cost", 0.0)

            # Update task totals
            state["tokens_used"] += execution["tokens_input"] + execution["tokens_output"]
            state["estimated_cost"] += execution["cost"]

            # Store result
            state["results"][agent_type] = {
                "output": result.get("content", ""),
                "tokens": execution["tokens_input"] + execution["tokens_output"],
                "cost": execution["cost"],
            }

        except Exception as e:
            execution["status"] = "failed"
            execution["error"] = str(e)

            logger.error(
                "Agent execution failed",
                task_id=state["task_id"],
                agent=agent_type,
                error=str(e),
            )

        finally:
            execution["completed_at"] = datetime.utcnow().isoformat()
            if execution["started_at"]:
                start = datetime.fromisoformat(execution["started_at"])
                end = datetime.fromisoformat(execution["completed_at"])
                execution["duration_ms"] = int((end - start).total_seconds() * 1000)

            await self._emit_event("agent_completed", {
                "task_id": state["task_id"],
                "phase": phase["number"],
                "agent": agent_type,
                "execution": execution,
            })

    def _build_agent_prompt(self, state: TaskState, agent_type: str) -> str:
        """Build prompt for an agent"""
        description = state["description"]
        previous_results = state.get("results", {})

        prompts = {
            "concept": f"""Analyze this development task and provide a clear breakdown:

Task: {description}

Provide:
1. Clear requirements list
2. User stories (if applicable)
3. Acceptance criteria
4. Scope boundaries

Be concise and actionable.""",

            "architect": f"""Design the technical architecture for this task:

Task: {description}

Previous Analysis:
{previous_results.get('concept', {}).get('output', 'N/A')}

Provide:
1. Component diagram (text-based)
2. Data flow description
3. API contracts (if applicable)
4. Technology recommendations

Be specific about implementation details.""",

            "implement": f"""Generate production-ready code for this task:

Task: {description}

Architecture Context:
{previous_results.get('architect', {}).get('output', 'N/A')}

Requirements:
- Follow best practices
- Include proper error handling
- Add necessary type annotations
- Make code testable

Generate complete, working code.""",

            "test": f"""Create comprehensive tests for this implementation:

Task: {description}

Implementation:
{previous_results.get('implement', {}).get('output', 'N/A')[:2000]}

Create:
1. Unit tests
2. Integration tests (if applicable)
3. Edge case tests
4. Error handling tests""",

            "review": f"""Review this code for quality and best practices:

Task: {description}

Code to Review:
{previous_results.get('implement', {}).get('output', 'N/A')[:2000]}

Check for:
1. Code quality issues
2. Performance concerns
3. Security vulnerabilities
4. Best practice violations

Provide actionable feedback.""",

            "security": f"""Perform a security audit on this implementation:

Task: {description}

Code to Audit:
{previous_results.get('implement', {}).get('output', 'N/A')[:2000]}

Check for:
1. OWASP Top 10 vulnerabilities
2. Input validation issues
3. Authentication/Authorization flaws
4. Data exposure risks""",

            "optimize": f"""Optimize this code for performance:

Task: {description}

Code to Optimize:
{previous_results.get('implement', {}).get('output', 'N/A')[:2000]}

Focus on:
1. Algorithm efficiency
2. Memory usage
3. Database queries (if applicable)
4. Caching opportunities""",

            "docs": f"""Generate documentation for this implementation:

Task: {description}

Code:
{previous_results.get('implement', {}).get('output', 'N/A')[:1500]}

Create:
1. Function/method documentation
2. Usage examples
3. API documentation (if applicable)
4. README content""",

            "deploy": f"""Create deployment configuration for this implementation:

Task: {description}

Implementation Context:
{previous_results.get('implement', {}).get('output', 'N/A')[:1000]}

Provide:
1. Docker configuration (if applicable)
2. CI/CD pipeline steps
3. Environment variables needed
4. Deployment checklist""",
        }

        return prompts.get(agent_type, f"Execute the {agent_type} task for: {description}")

    def on(self, event: str, handler: Callable) -> None:
        """Register an event handler"""
        if event not in self._event_handlers:
            self._event_handlers[event] = []
        self._event_handlers[event].append(handler)

    async def _emit_event(self, event: str, data: Any) -> None:
        """Emit an event to handlers and WebSocket"""
        # Call registered handlers
        if event in self._event_handlers:
            for handler in self._event_handlers[event]:
                try:
                    if asyncio.iscoroutinefunction(handler):
                        await handler(data)
                    else:
                        handler(data)
                except Exception as e:
                    logger.error("Event handler error", event=event, error=str(e))

        # Broadcast via WebSocket
        manager = get_manager()
        if isinstance(data, dict) and "task_id" in data:
            await manager.send_task_update(data["task_id"], event, data)
        else:
            await manager.broadcast({"type": event, "data": data})

    def get_stats(self) -> dict[str, Any]:
        """Get orchestrator statistics"""
        return {
            "current_mode": self._current_mode,
            "active_tasks": len(self._active_tasks),
            "queued_tasks": len(self._task_queue),
            "running_workers": len(self._workers),
            "max_workers": self._max_workers,
        }


# Singleton instance
_orchestrator_instance: OrchestratorEngine | None = None


async def get_orchestrator() -> OrchestratorEngine:
    """Get or create orchestrator instance"""
    global _orchestrator_instance
    if _orchestrator_instance is None:
        _orchestrator_instance = OrchestratorEngine()
        await _orchestrator_instance.start()
    return _orchestrator_instance


async def close_orchestrator() -> None:
    """Close orchestrator"""
    global _orchestrator_instance
    if _orchestrator_instance:
        await _orchestrator_instance.stop()
        _orchestrator_instance = None
