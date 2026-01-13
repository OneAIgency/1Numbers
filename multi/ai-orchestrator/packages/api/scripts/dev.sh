#!/bin/bash
# Development server script

set -e

# Change to API directory
cd "$(dirname "$0")/.."

# Activate virtual environment
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

source .venv/bin/activate

# Install dependencies if needed
if [ ! -f ".venv/.installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch .venv/.installed
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Copying from .env.example..."
    cp .env.example .env
fi

# Run the server
echo "Starting AI Orchestrator API..."
PYTHONPATH=. uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
