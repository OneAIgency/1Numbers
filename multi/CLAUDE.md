# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-Agent Orchestrator System for macOS with two main components:
1. **orchestrator-app**: Full macOS application (SwiftUI + FastAPI/LangGraph backend)
2. **orchestrator-cli**: Standalone Node.js CLI orchestrator

## Commands

### Backend (Python/FastAPI)
```bash
cd orchestrator-app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload          # Start server on http://127.0.0.1:8000
```

### CLI Orchestrator (Node.js)
```bash
cd orchestrator-cli
npm install
npm start -- --task "Your task"        # Run single task
npm start -- --task "Task" --workers 8 # Run with 8 parallel workers
npm run dev                             # Development mode (watch)
npm run build                           # TypeScript build
```

### macOS App
```bash
cd orchestrator-app/macOS
open OrchestratorApp.xcodeproj          # Open in Xcode
```

### API Testing
```bash
curl http://127.0.0.1:8000/api/health   # Health check
curl -X POST http://127.0.0.1:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Your task"}'     # Create task
```

## Architecture

```
multi/
├── orchestrator-app/
│   ├── backend/                  # FastAPI + LangChain/LangGraph
│   │   ├── api/                  # Routes (tasks, projects, monitoring) + WebSocket
│   │   └── services/
│   │       ├── orchestrator.py   # LangGraph workflow state machine
│   │       ├── claude.py         # Claude API client
│   │       ├── ollama.py         # Ollama client (local models)
│   │       ├── cache.py          # Redis cache
│   │       └── agents/           # Implement, Verify, Test agents
│   ├── macOS/                    # SwiftUI native app
│   │   └── OrchestratorApp/
│   │       ├── Views/            # SwiftUI views
│   │       └── Services/         # API + WebSocket services
│   ├── mcp-server/               # MCP Server (Node.js)
│   └── config/                   # Per-project configurations
│
└── orchestrator-cli/             # Standalone Node.js CLI
    ├── core/
    │   ├── Orchestrator.ts       # Main orchestration logic
    │   ├── TaskDecomposer.ts     # Task analysis & decomposition
    │   ├── WorkerPool.ts         # Worker thread management
    │   ├── TaskQueue.ts          # Dependency management
    │   └── ResultAggregator.ts   # Result collection
    ├── workers/                  # Worker thread scripts
    └── executors/                # Agent execution logic
```

### LangGraph Workflow (orchestrator-app/backend)

The backend uses LangGraph state machine with this flow:
1. **analyze** → Analyze task complexity with Claude
2. **decompose** → Break into phases and sub-tasks
3. **execute** → Execute current phase (parallel or sequential)
4. **verify** → Final verification (TypeScript, ESLint, build)

Phases can contain tasks that run in parallel (`phase.parallel = true`) or sequentially.

### Agent Types

- **ImplementAgent**: Generates code using Claude API or Ollama, reads project context from `app-truth.md`
- **VerifyAgent**: Runs `tsc --noEmit`, `npm run lint`, `npm run build`, architecture compliance checks
- **TestAgent**: Runs tests and generates reports

### Communication

- REST API for task CRUD operations
- WebSocket (`/ws`) for real-time progress updates
- SwiftUI app connects to backend via `APIService.swift` and `WebSocketService.swift`

## Environment Variables

Create `.env` in `orchestrator-app/backend/`:
```
ANTHROPIC_API_KEY=your-key
REDIS_URL=redis://localhost:6379
OLLAMA_BASE_URL=http://localhost:11434
PROJECT_PATH=../../numerology-compass    # Target project path
```

## Key Files

- `orchestrator-app/ARCHITECTURE.md` - Detailed architecture diagram and specs
- `orchestrator-app/SETUP.md` - Complete setup guide
- `orchestrator-cli/README.md` - CLI usage and examples

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, LangChain, LangGraph, Redis
- **CLI**: Node.js, TypeScript, tsx, worker threads
- **macOS App**: Swift, SwiftUI, Combine
- **AI**: Claude API (Anthropic), Ollama (local models)
