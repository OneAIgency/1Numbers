# Orchestrator macOS App - Architecture

## Overview

Aplicatie macOS nativă pentru orchestrator multi-agent cu:
- Interfață grafică SwiftUI
- Backend Python cu LangChain/LangGraph
- Integrare Claude API + Ollama
- MCP servers
- Cache Redis
- Setări customizate per proiect

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              macOS Native App (SwiftUI)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Main UI    │  │  Monitoring  │  │   Settings   │  │
│  │   (Tasks)    │  │  Dashboard   │  │   Manager    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Backend API   │
                    │  (FastAPI)     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  Orchestrator  │  │  LangChain/    │  │   MCP Server    │
│  Service       │  │  LangGraph     │  │                 │
│  (Node.js)     │  │  (Python)      │  │  (Node.js)      │
└───────┬────────┘  └────────┬───────┘  └────────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  Claude API    │  │    Ollama       │  │     Redis       │
│  (External)    │  │  (Local)       │  │    (Cache)      │
└────────────────┘  └────────────────┘  └────────────────┘
```

## Technology Stack

### Frontend (macOS Native)
- **SwiftUI** - Native macOS UI framework
- **Combine** - Reactive programming
- **Swift** - Programming language

### Backend Services
- **FastAPI** (Python) - Main API server
- **LangChain** - AI workflow orchestration
- **LangGraph** - State machine for AI workflows
- **Node.js** - Orchestrator service (existing)

### AI & Models
- **Claude API** - Anthropic Claude models
- **Ollama** - Local open-source models (Llama, Mistral, etc.)

### Infrastructure
- **Redis** - Caching layer
- **MCP Server** - Model Context Protocol
- **SQLite** - Local project settings storage

## Project Structure

```
orchestrator-app/
├── macOS/                    # SwiftUI macOS app
│   ├── OrchestratorApp/
│   │   ├── App.swift
│   │   ├── Views/
│   │   │   ├── MainView.swift
│   │   │   ├── TaskListView.swift
│   │   │   ├── MonitoringView.swift
│   │   │   └── SettingsView.swift
│   │   ├── ViewModels/
│   │   ├── Services/
│   │   │   ├── APIService.swift
│   │   │   └── WebSocketService.swift
│   │   └── Models/
│   └── OrchestratorApp.xcodeproj
│
├── backend/                  # Python backend
│   ├── api/
│   │   ├── main.py          # FastAPI app
│   │   ├── routes/
│   │   │   ├── tasks.py
│   │   │   ├── projects.py
│   │   │   └── monitoring.py
│   │   └── websocket.py
│   ├── services/
│   │   ├── orchestrator.py  # LangChain/LangGraph
│   │   ├── claude.py        # Claude API client
│   │   ├── ollama.py        # Ollama client
│   │   └── cache.py         # Redis client
│   ├── agents/
│   │   ├── implement_agent.py
│   │   ├── verify_agent.py
│   │   └── test_agent.py
│   └── requirements.txt
│
├── mcp-server/              # MCP Server
│   ├── src/
│   │   ├── index.ts
│   │   └── handlers/
│   └── package.json
│
├── orchestrator/            # Existing Node.js orchestrator
│   └── (existing code)
│
└── config/                  # Configuration files
    ├── projects/            # Per-project settings
    └── models.json          # Model configurations
```

## Key Features

### 1. Task Management
- Create/edit/delete tasks
- Task decomposition using LangChain
- Dependency visualization
- Real-time progress tracking

### 2. Monitoring Dashboard
- Live task execution status
- Worker thread monitoring
- Resource usage (CPU, Memory)
- Execution timeline
- Error tracking

### 3. AI Integration
- Claude API for complex reasoning
- Ollama for local model execution
- Model switching per task
- Cost tracking (Claude API)

### 4. Project Settings
- Per-project configurations
- Custom agent definitions
- Model preferences
- Cache settings
- MCP server endpoints

### 5. Cache System
- Redis for task results
- Model response caching
- Project state caching
- Configurable TTL

## Communication Flow

1. **User creates task** → SwiftUI app
2. **Task sent to API** → FastAPI backend
3. **Task decomposed** → LangChain/LangGraph
4. **Agents execute** → Claude API or Ollama
5. **Results cached** → Redis
6. **Updates streamed** → WebSocket → SwiftUI
7. **Settings saved** → SQLite (per project)

## Performance Optimizations

- **M4 Pro specific**: Native ARM64 builds
- **Memory management**: Efficient worker pool
- **Caching**: Aggressive caching for repeated tasks
- **Local models**: Ollama for faster responses
- **Parallel execution**: Up to 8 workers (M4 Pro)

## Security

- API keys stored in macOS Keychain
- Project settings encrypted
- Local-only Redis (no network exposure)
- MCP server authentication

