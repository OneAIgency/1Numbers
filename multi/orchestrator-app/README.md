# Orchestrator macOS App

Aplicație macOS nativă pentru orchestrator multi-agent cu interfață grafică, monitorizare în timp real, și integrare Claude API + Ollama.

## Features

- 🎨 **Native macOS UI** - SwiftUI interface
- 🤖 **AI-Powered** - Claude API + Ollama local models
- 📊 **Real-time Monitoring** - Live task execution dashboard
- ⚙️ **Project Settings** - Customizable per-project configurations
- 🚀 **Parallel Execution** - Optimized for M4 Pro (up to 8 workers)
- 💾 **Smart Caching** - Redis cache layer
- 🔌 **MCP Integration** - Model Context Protocol support

## Requirements

- macOS 14.0+ (Sonoma)
- Xcode 15.0+
- Python 3.11+
- Node.js 20+
- Redis (local)
- Ollama (for local models)

## Installation

### 1. Install Dependencies

```bash
# Backend Python dependencies
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# MCP Server
cd ../mcp-server
npm install

# Orchestrator (existing)
cd ../orchestrator
npm install
```

### 2. Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama2
ollama pull mistral
```

### 3. Start Redis

```bash
brew install redis
brew services start redis
```

### 4. Configure API Keys

```bash
# Set Claude API key (stored in macOS Keychain)
export ANTHROPIC_API_KEY="your-key-here"
```

### 5. Build macOS App

```bash
cd macOS
xcodebuild -project OrchestratorApp.xcodeproj -scheme OrchestratorApp
```

## Usage

### Start Backend Services

```bash
# Terminal 1: FastAPI backend
cd backend
source venv/bin/activate
uvicorn api.main:app --reload

# Terminal 2: MCP Server
cd mcp-server
npm start

# Terminal 3: Orchestrator service
cd orchestrator
npm start
```

### Launch macOS App

Open `OrchestratorApp.app` or run from Xcode.

## Configuration

### Project Settings

Each project can have custom settings in `config/projects/{project-name}.json`:

```json
{
  "name": "numerology-compass",
  "maxWorkers": 8,
  "preferredModel": "claude-3-opus",
  "fallbackModel": "ollama:llama2",
  "cacheEnabled": true,
  "cacheTTL": 3600,
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

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
uvicorn api.main:app --reload --port 8000
```

### macOS App Development

```bash
cd macOS
open OrchestratorApp.xcodeproj
```

### Testing

```bash
# Backend tests
cd backend
pytest

# MCP Server tests
cd mcp-server
npm test
```

## Roadmap

- [x] Basic architecture
- [ ] SwiftUI interface
- [ ] FastAPI backend
- [ ] LangChain integration
- [ ] Claude API client
- [ ] Ollama integration
- [ ] Redis cache
- [ ] MCP server
- [ ] Project settings
- [ ] Real-time monitoring
- [ ] Task visualization

## License

MIT

