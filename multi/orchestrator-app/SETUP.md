# Setup Guide - Orchestrator macOS App

## Prerequisites

### 1. Install System Dependencies

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3.11+
brew install python@3.11

# Install Node.js 20+
brew install node@20

# Install Redis
brew install redis
brew services start redis

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Install Ollama Models

```bash
# Pull recommended models
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

### 3. Setup Backend

```bash
cd orchestrator-app/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and add your Claude API key
# ANTHROPIC_API_KEY=your-key-here
```

### 4. Setup MCP Server

```bash
cd orchestrator-app/mcp-server
npm install
npm run build
```

### 5. Setup Existing Orchestrator

```bash
cd .claude/orchestrator
npm install
```

## Running the Application

### Start Backend Services

**Terminal 1 - FastAPI Backend:**
```bash
cd orchestrator-app/backend
source venv/bin/activate
uvicorn api.main:app --reload --port 8000
```

**Terminal 2 - MCP Server (optional):**
```bash
cd orchestrator-app/mcp-server
npm start
```

**Terminal 3 - Verify Services:**
```bash
# Check API health
curl http://127.0.0.1:8000/api/health

# Check Redis
redis-cli ping

# Check Ollama
curl http://localhost:11434/api/tags
```

### Build and Run macOS App

1. Open Xcode:
```bash
cd orchestrator-app/macOS
open OrchestratorApp.xcodeproj
```

2. In Xcode:
   - Select target: `OrchestratorApp`
   - Select scheme: `OrchestratorApp`
   - Click Run (⌘R)

Or build from command line:
```bash
cd orchestrator-app/macOS
xcodebuild -project OrchestratorApp.xcodeproj -scheme OrchestratorApp -configuration Debug
open build/Debug/OrchestratorApp.app
```

## Configuration

### Project Settings

Create project configuration:
```bash
mkdir -p orchestrator-app/config/projects
```

Example project config (`orchestrator-app/config/projects/numerology-compass.json`):
```json
{
  "name": "numerology-compass",
  "max_workers": 8,
  "preferred_model": "claude-3-opus",
  "fallback_model": "ollama:llama2",
  "cache_enabled": true,
  "cache_ttl": 3600,
  "agents": {
    "implement": {
      "model": "claude-3-sonnet",
      "temperature": 0.7
    },
    "verify": {
      "model": "ollama:mistral",
      "temperature": 0.3
    }
  }
}
```

### API Keys

Store Claude API key securely:
```bash
# macOS Keychain (recommended)
security add-generic-password -a orchestrator -s claude-api-key -w "your-key"

# Or environment variable
export ANTHROPIC_API_KEY="your-key"
```

## Development

### Backend Development

```bash
cd orchestrator-app/backend
source venv/bin/activate

# Run with hot reload
uvicorn api.main:app --reload

# Run tests
pytest

# Check API docs
open http://127.0.0.1:8000/docs
```

### macOS App Development

```bash
cd orchestrator-app/macOS
open OrchestratorApp.xcodeproj
```

### MCP Server Development

```bash
cd orchestrator-app/mcp-server
npm run dev
```

## Troubleshooting

### Backend won't start
- Check Python version: `python3 --version` (should be 3.11+)
- Check virtual environment is activated
- Check Redis is running: `redis-cli ping`

### Ollama not working
- Check Ollama is running: `ollama list`
- Check models are installed: `ollama list`
- Test manually: `ollama run llama2 "Hello"`

### macOS App can't connect
- Check backend is running: `curl http://127.0.0.1:8000/api/health`
- Check API URL in Settings matches backend URL
- Check firewall settings

### Redis connection errors
- Start Redis: `brew services start redis`
- Check Redis is running: `redis-cli ping`
- Check REDIS_URL in .env

## Architecture Overview

```
macOS App (SwiftUI)
    ↓ HTTP/WebSocket
FastAPI Backend (Python)
    ↓
├── LangChain/LangGraph (AI workflows)
├── Claude API (Cloud models)
├── Ollama (Local models)
├── Redis (Cache)
└── MCP Server (Model Context Protocol)
```

## Next Steps

1. ✅ Backend setup complete
2. ✅ MCP server ready
3. ✅ macOS app structure created
4. ⏳ Build Xcode project
5. ⏳ Test end-to-end workflow
6. ⏳ Add more agent types
7. ⏳ Implement code generation
8. ⏳ Add project templates

