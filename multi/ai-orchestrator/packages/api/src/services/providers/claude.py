"""
Claude Service

Anthropic Claude API integration with caching and cost tracking.
"""

import time
from typing import Any, AsyncGenerator

import anthropic
import structlog

from src.config import settings
from src.services.cache import CacheService

logger = structlog.get_logger()


# Pricing per 1K tokens (as of 2025)
CLAUDE_PRICING = {
    "claude-opus-4-5-20251101": {"input": 0.015, "output": 0.075},
    "claude-3-5-sonnet-20241022": {"input": 0.003, "output": 0.015},
    "claude-3-5-haiku-20241022": {"input": 0.0008, "output": 0.004},
    "claude-3-opus-20240229": {"input": 0.015, "output": 0.075},
    "claude-3-sonnet-20240229": {"input": 0.003, "output": 0.015},
    "claude-3-haiku-20240307": {"input": 0.00025, "output": 0.00125},
}


class ClaudeService:
    """Claude API service with caching and cost tracking"""

    def __init__(self, cache: CacheService | None = None) -> None:
        self._client: anthropic.AsyncAnthropic | None = None
        self._cache = cache
        self._initialized = False

    async def initialize(self) -> None:
        """Initialize the Claude client"""
        if not settings.anthropic_api_key:
            logger.warning("Anthropic API key not configured")
            return

        self._client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        self._initialized = True
        logger.info("Claude service initialized")

    @property
    def is_available(self) -> bool:
        """Check if Claude is available"""
        return self._initialized and self._client is not None

    async def generate(
        self,
        prompt: str,
        *,
        model: str | None = None,
        system_prompt: str | None = None,
        temperature: float | None = None,
        max_tokens: int | None = None,
        use_cache: bool = True,
    ) -> dict[str, Any]:
        """
        Generate text using Claude API.

        Returns:
            dict with keys: content, model, tokens_input, tokens_output, cost, duration
        """
        if not self.is_available:
            raise RuntimeError("Claude service not initialized")

        model = model or settings.claude_default_model
        temperature = temperature if temperature is not None else settings.claude_temperature
        max_tokens = max_tokens or settings.claude_max_tokens

        # Check cache
        if use_cache and self._cache:
            cache_key = CacheService.generate_key(
                "claude", model, prompt[:100], str(temperature)
            )
            cached = await self._cache.get(cache_key)
            if cached:
                logger.debug("Cache hit for Claude request", model=model)
                return cached

        # Build messages
        messages = [{"role": "user", "content": prompt}]

        # Make API call
        start_time = time.time()
        try:
            response = await self._client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt or "You are a helpful AI assistant specialized in software development.",
                messages=messages,
            )

            duration = time.time() - start_time

            # Extract content
            content = ""
            for block in response.content:
                if hasattr(block, "text"):
                    content += block.text

            # Calculate cost
            tokens_input = response.usage.input_tokens
            tokens_output = response.usage.output_tokens
            cost = self.calculate_cost(model, tokens_input, tokens_output)

            result = {
                "content": content,
                "model": model,
                "tokens_input": tokens_input,
                "tokens_output": tokens_output,
                "cost": cost,
                "duration": duration,
                "finish_reason": response.stop_reason,
            }

            # Cache result
            if use_cache and self._cache:
                await self._cache.set(cache_key, result, ttl=3600)

            logger.info(
                "Claude generation completed",
                model=model,
                tokens_in=tokens_input,
                tokens_out=tokens_output,
                cost=cost,
                duration=f"{duration:.2f}s",
            )

            return result

        except anthropic.RateLimitError as e:
            logger.error("Claude rate limit exceeded", error=str(e))
            raise
        except anthropic.APIError as e:
            logger.error("Claude API error", error=str(e))
            raise

    async def generate_stream(
        self,
        prompt: str,
        *,
        model: str | None = None,
        system_prompt: str | None = None,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> AsyncGenerator[dict[str, Any], None]:
        """
        Generate text using Claude API with streaming.

        Yields:
            dict with keys: content (chunk), done, tokens (final only)
        """
        if not self.is_available:
            raise RuntimeError("Claude service not initialized")

        model = model or settings.claude_default_model
        temperature = temperature if temperature is not None else settings.claude_temperature
        max_tokens = max_tokens or settings.claude_max_tokens

        messages = [{"role": "user", "content": prompt}]

        async with self._client.messages.stream(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt or "You are a helpful AI assistant specialized in software development.",
            messages=messages,
        ) as stream:
            async for text in stream.text_stream:
                yield {"content": text, "done": False}

            # Final message with usage
            response = await stream.get_final_message()
            tokens_input = response.usage.input_tokens
            tokens_output = response.usage.output_tokens
            cost = self.calculate_cost(model, tokens_input, tokens_output)

            yield {
                "content": "",
                "done": True,
                "tokens_input": tokens_input,
                "tokens_output": tokens_output,
                "cost": cost,
            }

    async def analyze_task(self, description: str) -> dict[str, Any]:
        """
        Analyze a task description to determine complexity and required agents.
        """
        prompt = f"""Analyze this development task and provide a JSON response:

Task: {description}

Provide your analysis in the following JSON format:
{{
    "complexity": "simple" | "medium" | "complex",
    "estimated_duration_minutes": <number>,
    "required_agents": ["concept", "architect", "implement", "test", "review", "docs"],
    "suggested_approach": "<brief description>",
    "risks": ["<risk1>", "<risk2>"],
    "success_criteria": ["<criterion1>", "<criterion2>"]
}}

Only output valid JSON, no markdown or explanation."""

        result = await self.generate(
            prompt,
            temperature=0.3,
            max_tokens=1000,
        )

        # Parse JSON from response
        content = result["content"]
        try:
            import json
            # Try to extract JSON from the response
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0]
            else:
                json_str = content

            analysis = json.loads(json_str.strip())
            return {
                **analysis,
                "tokens_used": result["tokens_input"] + result["tokens_output"],
                "cost": result["cost"],
            }
        except json.JSONDecodeError:
            logger.warning("Failed to parse task analysis JSON", content=content[:200])
            return {
                "complexity": "medium",
                "estimated_duration_minutes": 30,
                "required_agents": ["implement", "test"],
                "suggested_approach": description,
                "risks": [],
                "success_criteria": [],
                "tokens_used": result["tokens_input"] + result["tokens_output"],
                "cost": result["cost"],
            }

    async def decompose_task(self, description: str) -> dict[str, Any]:
        """
        Decompose a task into phases and subtasks.
        """
        prompt = f"""Decompose this development task into phases:

Task: {description}

Provide your decomposition in the following JSON format:
{{
    "phases": [
        {{
            "number": 1,
            "name": "Phase Name",
            "description": "What this phase accomplishes",
            "parallel": false,
            "tasks": [
                {{
                    "description": "Specific task",
                    "agent": "implement" | "test" | "review" | "docs" | "concept" | "architect" | "security" | "deploy",
                    "estimated_minutes": 10
                }}
            ]
        }}
    ],
    "total_estimated_minutes": <number>
}}

Only output valid JSON, no markdown or explanation."""

        result = await self.generate(
            prompt,
            temperature=0.4,
            max_tokens=2000,
        )

        content = result["content"]
        try:
            import json
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0]
            else:
                json_str = content

            decomposition = json.loads(json_str.strip())
            return {
                **decomposition,
                "tokens_used": result["tokens_input"] + result["tokens_output"],
                "cost": result["cost"],
            }
        except json.JSONDecodeError:
            logger.warning("Failed to parse task decomposition JSON", content=content[:200])
            return {
                "phases": [
                    {
                        "number": 1,
                        "name": "Implementation",
                        "description": description,
                        "parallel": False,
                        "tasks": [{"description": description, "agent": "implement", "estimated_minutes": 30}]
                    }
                ],
                "total_estimated_minutes": 30,
                "tokens_used": result["tokens_input"] + result["tokens_output"],
                "cost": result["cost"],
            }

    async def generate_code(
        self,
        task_description: str,
        context: str,
        *,
        file_path: str | None = None,
        language: str = "typescript",
    ) -> dict[str, Any]:
        """
        Generate code for a specific task.
        """
        prompt = f"""Generate production-ready {language} code for this task:

Task: {task_description}
{f"File: {file_path}" if file_path else ""}

Project Context:
{context}

Requirements:
- Follow existing code patterns exactly
- Use proper types (no 'any' without justification)
- Add JSDoc/docstring comments for functions
- Handle all error cases
- Ensure code compiles without errors

Provide complete, production-ready code."""

        result = await self.generate(
            prompt,
            model=settings.claude_default_model,
            temperature=0.7,
            max_tokens=4096,
        )

        return {
            "code": result["content"],
            "tokens_used": result["tokens_input"] + result["tokens_output"],
            "cost": result["cost"],
        }

    @staticmethod
    def calculate_cost(model: str, tokens_input: int, tokens_output: int) -> float:
        """Calculate cost for a generation"""
        pricing = CLAUDE_PRICING.get(model, {"input": 0.003, "output": 0.015})
        return (tokens_input / 1000) * pricing["input"] + (tokens_output / 1000) * pricing["output"]

    async def health_check(self) -> dict[str, Any]:
        """Check Claude API health"""
        if not self.is_available:
            return {"status": "unavailable", "error": "Not initialized"}

        try:
            # Simple test message
            response = await self._client.messages.create(
                model="claude-3-5-haiku-20241022",
                max_tokens=10,
                messages=[{"role": "user", "content": "Hi"}],
            )
            return {
                "status": "healthy",
                "model": "claude-3-5-haiku-20241022",
                "latency_hint": "fast",
            }
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}


# Singleton instance
_claude_instance: ClaudeService | None = None


async def get_claude(cache: CacheService | None = None) -> ClaudeService:
    """Get or create Claude service instance"""
    global _claude_instance
    if _claude_instance is None:
        _claude_instance = ClaudeService(cache)
        await _claude_instance.initialize()
    return _claude_instance


async def close_claude() -> None:
    """Close Claude service"""
    global _claude_instance
    _claude_instance = None
