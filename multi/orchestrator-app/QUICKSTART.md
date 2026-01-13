# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies (one-time)

```bash
# Install system dependencies
brew install python@3.11 node@20 redis ollama

# Start services
brew services start redis
ollama pull llama2
```

### 2. Setup Backend

```bash
cd orchestrator-app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add your Claude API key
echo "ANTHROPIC_API_KEY=your-key" > .env
```

### 3. Start Backend

```bash
# In backend directory
source venv/bin/activate
uvicorn api.main:app --reload
```

### 4. Open macOS App

```bash
cd orchestrator-app/macOS
open OrchestratorApp.xcodeproj
# Click Run in Xcode
```

## First Task

1. Click "New Task" in macOS app
2. Enter: "Add new feature to numerology calculator"
3. Click "Create"
4. Watch real-time progress in Monitoring view

## Features

- ✅ Native macOS UI
- ✅ Real-time task monitoring
- ✅ Claude API integration
- ✅ Ollama local models
- ✅ Redis caching
- ✅ MCP server support
- ✅ Per-project settings

## Need Help?

See [SETUP.md](./SETUP.md) for detailed setup instructions.

