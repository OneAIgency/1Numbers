"""
Ollama Service

Local Ollama API integration for cost-effective model inference.
"""

import time
from typing import Any, AsyncGenerator

import httpx
import structlog

from src.config import settings

logger = structlog.get_logger()


class OllamaService:
    """Ollama local model service"""

    def __init__(self) -> None:
        self._base_url = settings.ollama_base_url
        self._timeout = settings.ollama_timeout
        self._client: httpx.AsyncClient | None = None
        self._available_models: list[str] = []
        self._initialized = False

    async def initialize(self) -> None:
        """Initialize the Ollama client and check available models"""
        self._client = httpx.AsyncClient(
            base_url=self._base_url,
            timeout=httpx.Timeout(self._timeout),
        )

        try:
            # Check if Ollama is running and get models
            response = await self._client.get("/api/tags")
            if response.status_code == 200:
                data = response.json()
                self._available_models = [m["name"] for m in data.get("models", [])]
                self._initialized = True
                logger.info(
                    "Ollama service initialized",
                    models=self._available_models,
                )
            else:
                logger.warning("Ollama not responding correctly", status=response.status_code)
        except httpx.ConnectError:
            logger.warning("Ollama not available at", url=self._base_url)
        except Exception as e:
            logger.warning("Failed to initialize Ollama", error=str(e))

    @property
    def is_available(self) -> bool:
        """Check if Ollama is available"""
        return self._initialized and self._client is not None

    def get_available_models(self) -> list[str]:
        """Get list of available models"""
        return self._available_models

    async def generate(
        self,
        prompt: str,
        *,
        model: str | None = None,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> dict[str, Any]:
        """
        Generate text using Ollama.

        Returns:
            dict with keys: content, model, tokens_input, tokens_output, duration
        """
        if not self.is_available:
            raise RuntimeError("Ollama service not available")

        model = model or settings.ollama_default_model

        # Check if model is available
        if model not in self._available_models:
            # Try to find a similar model
            for available in self._available_models:
                if model.split(":")[0] in available:
                    model = available
                    break
            else:
                logger.warning("Requested model not available", model=model, available=self._available_models)

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }

        if system_prompt:
            payload["system"] = system_prompt

        start_time = time.time()
        try:
            response = await self._client.post("/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()

            duration = time.time() - start_time

            # Ollama returns different metrics
            result = {
                "content": data.get("response", ""),
                "model": model,
                "tokens_input": data.get("prompt_eval_count", 0),
                "tokens_output": data.get("eval_count", 0),
                "cost": 0.0,  # Local models are free
                "duration": duration,
                "finish_reason": "stop" if data.get("done") else "incomplete",
            }

            logger.info(
                "Ollama generation completed",
                model=model,
                tokens_out=result["tokens_output"],
                duration=f"{duration:.2f}s",
            )

            return result

        except httpx.TimeoutException:
            logger.error("Ollama request timeout", model=model)
            raise
        except httpx.HTTPStatusError as e:
            logger.error("Ollama HTTP error", status=e.response.status_code, error=str(e))
            raise
        except Exception as e:
            logger.error("Ollama error", error=str(e))
            raise

    async def generate_stream(
        self,
        prompt: str,
        *,
        model: str | None = None,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AsyncGenerator[dict[str, Any], None]:
        """
        Generate text using Ollama with streaming.

        Yields:
            dict with keys: content (chunk), done
        """
        if not self.is_available:
            raise RuntimeError("Ollama service not available")

        model = model or settings.ollama_default_model

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }

        if system_prompt:
            payload["system"] = system_prompt

        try:
            async with self._client.stream("POST", "/api/generate", json=payload) as response:
                response.raise_for_status()
                total_tokens = 0

                async for line in response.aiter_lines():
                    if line:
                        import json
                        data = json.loads(line)

                        if data.get("done"):
                            yield {
                                "content": "",
                                "done": True,
                                "tokens_output": data.get("eval_count", total_tokens),
                                "cost": 0.0,
                            }
                        else:
                            content = data.get("response", "")
                            total_tokens += 1
                            yield {"content": content, "done": False}

        except Exception as e:
            logger.error("Ollama streaming error", error=str(e))
            raise

    async def analyze_task(self, description: str, model: str | None = None) -> dict[str, Any]:
        """
        Analyze a task using local model.
        """
        prompt = f"""Analyze this development task:

Task: {description}

Provide a brief analysis including:
1. Complexity (simple/medium/complex)
2. Required steps
3. Potential challenges

Keep your response concise and practical."""

        result = await self.generate(
            prompt,
            model=model,
            temperature=0.5,
            max_tokens=500,
        )

        return {
            "analysis": result["content"],
            "tokens_used": result["tokens_input"] + result["tokens_output"],
            "cost": 0.0,
        }

    async def pull_model(self, model: str) -> bool:
        """
        Pull a model from Ollama registry.
        """
        if not self._client:
            return False

        try:
            response = await self._client.post(
                "/api/pull",
                json={"name": model},
                timeout=httpx.Timeout(600.0),  # 10 minutes for large models
            )
            response.raise_for_status()
            logger.info("Model pulled successfully", model=model)

            # Refresh available models
            await self.initialize()
            return True
        except Exception as e:
            logger.error("Failed to pull model", model=model, error=str(e))
            return False

    async def health_check(self) -> dict[str, Any]:
        """Check Ollama health"""
        if not self.is_available:
            return {"status": "unavailable", "error": "Not initialized"}

        try:
            response = await self._client.get("/api/tags")
            if response.status_code == 200:
                return {
                    "status": "healthy",
                    "models": self._available_models,
                    "model_count": len(self._available_models),
                }
            return {"status": "unhealthy", "error": f"HTTP {response.status_code}"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    async def close(self) -> None:
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None
            self._initialized = False


# Singleton instance
_ollama_instance: OllamaService | None = None


async def get_ollama() -> OllamaService:
    """Get or create Ollama service instance"""
    global _ollama_instance
    if _ollama_instance is None:
        _ollama_instance = OllamaService()
        await _ollama_instance.initialize()
    return _ollama_instance


async def close_ollama() -> None:
    """Close Ollama service"""
    global _ollama_instance
    if _ollama_instance:
        await _ollama_instance.close()
        _ollama_instance = None
