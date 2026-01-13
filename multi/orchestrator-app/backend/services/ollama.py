"""
Ollama Service for local models
"""

import httpx
from typing import Dict, Optional, List
import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")


class OllamaService:
    def __init__(self):
        self.base_url = OLLAMA_BASE_URL
        self.client = httpx.AsyncClient(timeout=300.0)  # 5 min timeout for large models

    async def list_models(self) -> List[str]:
        """List available Ollama models"""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags")
            data = response.json()
            return [model["name"] for model in data.get("models", [])]
        except Exception as e:
            print(f"Error listing Ollama models: {e}")
            return []

    async def generate(
        self,
        model: str,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate text using Ollama"""
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature
                }
            }
            
            if system:
                payload["system"] = system
            
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            data = response.json()
            return data.get("response", "")
        except Exception as e:
            print(f"Error generating with Ollama: {e}")
            return f"Error: {str(e)}"

    async def analyze_task(self, description: str, model: str = "llama2") -> Dict:
        """Analyze task using local model"""
        prompt = f"""Analyze this development task:
{description}

Provide complexity level and required steps."""
        
        response = await self.generate(model, prompt)
        
        # Parse response (simplified)
        return {
            "complexity": "MEDIUM",
            "analysis": response,
            "model": model
        }

    async def health_check(self) -> bool:
        """Check if Ollama is running"""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags", timeout=5.0)
            return response.status_code == 200
        except:
            return False

