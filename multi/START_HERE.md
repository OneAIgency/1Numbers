# 🚀 Start Here - Multi-Agent Orchestrator

## Quick Start (5 minutes)

### 1. Setup Environment

```bash
# Navigate to multi directory
cd multi/orchestrator-app/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure API Keys

```bash
# Create .env file
cat > .env << EOF
ANTHROPIC_API_KEY=your-claude-api-key-here
REDIS_URL=redis://localhost:6379
OLLAMA_BASE_URL=http://localhost:11434
PROJECT_PATH=../../numerology-compass
EOF
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd multi/orchestrator-app/backend
source venv/bin/activate
uvicorn api.main:app --reload
```

**Terminal 2 - Verify it works:**
```bash
curl http://127.0.0.1:8000/api/health
```

### 4. Create Your First Task

```bash
curl -X POST http://127.0.0.1:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Add new feature: biorhythm calculator",
    "project_id": "numerology-compass"
  }'
```

### 5. Monitor Progress

```bash
# Get task ID from previous response, then:
curl http://127.0.0.1:8000/api/tasks/{task_id}
```

## What Happens?

1. ✅ Task is analyzed by Claude
2. ✅ Task is decomposed into phases
3. ✅ Code is generated and written to files
4. ✅ Code is verified (TypeScript, ESLint, Build)
5. ✅ Tests are run
6. ✅ Results are cached in Redis
7. ✅ Progress updates via WebSocket

## Next Steps

- Open macOS app: `cd multi/orchestrator-app/macOS && open OrchestratorApp.xcodeproj`
- See [SETUP.md](./orchestrator-app/SETUP.md) for detailed setup
- See [ARCHITECTURE.md](./orchestrator-app/ARCHITECTURE.md) for architecture details

## Troubleshooting

**Backend won't start?**
- Check Python version: `python3 --version` (need 3.11+)
- Check virtual environment: `which python` (should be in venv)
- Check Redis: `redis-cli ping` (should return PONG)

**Claude API errors?**
- Verify API key in .env
- Check API key has credits

**Ollama not working?**
- Install: `curl -fsSL https://ollama.com/install.sh | sh`
- Pull model: `ollama pull llama2`
- Test: `ollama run llama2 "Hello"`

