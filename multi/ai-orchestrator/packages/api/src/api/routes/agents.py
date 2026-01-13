"""
Agent Routes

Information about available agents.
"""

from fastapi import APIRouter

from src.api.schemas import AgentInfo, AgentListResponse

router = APIRouter(prefix="/agents", tags=["agents"])

# Agent definitions
AGENT_CATALOG = {
    "concept": {
        "name": "Concept Agent",
        "description": "Analyzes requirements and generates user stories",
        "capabilities": ["requirement_analysis", "user_story_generation", "scope_definition"],
        "dependencies": [],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "architect": {
        "name": "Architect Agent",
        "description": "Designs system architecture and component diagrams",
        "capabilities": ["architecture_design", "component_design", "api_design", "database_schema"],
        "dependencies": ["concept"],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "implement": {
        "name": "Implementation Agent",
        "description": "Generates and writes production code",
        "capabilities": ["code_generation", "file_creation", "code_modification"],
        "dependencies": [],
        "supported_modes": ["SPEED", "QUALITY", "AUTONOMY", "COST"],
    },
    "test": {
        "name": "Test Agent",
        "description": "Creates and runs tests",
        "capabilities": ["test_generation", "test_execution", "coverage_analysis"],
        "dependencies": ["implement"],
        "supported_modes": ["QUALITY", "AUTONOMY", "COST"],
    },
    "review": {
        "name": "Review Agent",
        "description": "Performs code review and best practices check",
        "capabilities": ["code_review", "best_practices", "code_quality"],
        "dependencies": ["implement"],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "optimize": {
        "name": "Optimization Agent",
        "description": "Optimizes code for performance",
        "capabilities": ["performance_analysis", "optimization", "profiling"],
        "dependencies": ["implement", "test"],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "docs": {
        "name": "Documentation Agent",
        "description": "Generates technical documentation",
        "capabilities": ["api_docs", "readme_generation", "inline_docs"],
        "dependencies": ["implement"],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "deploy": {
        "name": "Deployment Agent",
        "description": "Handles deployment automation",
        "capabilities": ["deploy_config", "ci_cd_setup", "infrastructure"],
        "dependencies": ["test", "review"],
        "supported_modes": ["AUTONOMY"],
    },
    "security": {
        "name": "Security Agent",
        "description": "Performs security audit and vulnerability scan",
        "capabilities": ["security_audit", "vulnerability_scan", "security_fixes"],
        "dependencies": ["implement"],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "refactor": {
        "name": "Refactor Agent",
        "description": "Refactors code for better structure",
        "capabilities": ["code_refactoring", "pattern_application", "debt_reduction"],
        "dependencies": [],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
    "debug": {
        "name": "Debug Agent",
        "description": "Assists with debugging issues",
        "capabilities": ["error_analysis", "debugging", "root_cause_analysis"],
        "dependencies": [],
        "supported_modes": ["SPEED", "QUALITY", "AUTONOMY", "COST"],
    },
    "migrate": {
        "name": "Migration Agent",
        "description": "Handles code migrations and upgrades",
        "capabilities": ["dependency_upgrade", "code_migration", "compatibility"],
        "dependencies": [],
        "supported_modes": ["QUALITY", "AUTONOMY"],
    },
}


@router.get("", response_model=AgentListResponse)
async def list_agents() -> AgentListResponse:
    """
    List all available agents with their capabilities.
    """
    agents = [
        AgentInfo(
            type=agent_type,
            name=info["name"],
            description=info["description"],
            capabilities=info["capabilities"],
            dependencies=info["dependencies"],
            supported_modes=info["supported_modes"],
        )
        for agent_type, info in AGENT_CATALOG.items()
    ]

    return AgentListResponse(agents=agents)


@router.get("/{agent_type}", response_model=AgentInfo)
async def get_agent(agent_type: str) -> AgentInfo:
    """
    Get details about a specific agent.
    """
    from fastapi import HTTPException

    if agent_type not in AGENT_CATALOG:
        raise HTTPException(status_code=404, detail="Agent not found")

    info = AGENT_CATALOG[agent_type]
    return AgentInfo(
        type=agent_type,
        name=info["name"],
        description=info["description"],
        capabilities=info["capabilities"],
        dependencies=info["dependencies"],
        supported_modes=info["supported_modes"],
    )
