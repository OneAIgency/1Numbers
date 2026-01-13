# Multi-Agent Orchestrator System

Sistem complet de orchestrator multi-agent pentru macOS cu interfață grafică nativă.

## Structură

```
multi/
├── orchestrator-app/          # Aplicație macOS completă
│   ├── macOS/                 # SwiftUI app
│   ├── backend/               # FastAPI + LangChain/LangGraph
│   ├── mcp-server/           # MCP Server
│   └── config/               # Configurații
│
└── orchestrator-cli/          # Orchestrator CLI (Node.js)
    ├── core/                  # Core logic
    ├── workers/              # Worker threads
    └── executors/            # Agent executors
```

## Quick Start

### Backend
```bash
cd orchestrator-app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

### CLI Orchestrator
```bash
cd orchestrator-cli
npm install
npm start -- --task "Your task description"
```

### macOS App
```bash
cd orchestrator-app/macOS
open OrchestratorApp.xcodeproj
```

## Documentație

- [ARCHITECTURE.md](./orchestrator-app/ARCHITECTURE.md) - Arhitectură detaliată
- [SETUP.md](./orchestrator-app/SETUP.md) - Ghid de instalare
- [QUICKSTART.md](./orchestrator-app/QUICKSTART.md) - Start rapid

