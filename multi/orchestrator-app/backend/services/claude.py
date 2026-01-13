"""
Claude API Service
"""

import os
from typing import Dict, List, Optional
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, SystemMessage

from services.cache import CacheService


class ClaudeService:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not set")
        
        self.client = ChatAnthropic(
            model="claude-3-opus-20240229",
            temperature=0.7,
            api_key=api_key
        )
        self.cache = CacheService()

    async def analyze_task(self, description: str) -> Dict:
        """Analyze task complexity and requirements"""
        cache_key = f"claude:analyze:{hash(description)}"
        
        # Check cache
        cached = await self.cache.get(cache_key)
        if cached:
            return cached
        
        prompt = f"""Analyze this development task and determine:
1. Complexity level (LOW, MEDIUM, HIGH)
2. Estimated time
3. Required agents
4. Dependencies

Task: {description}

Respond in JSON format."""
        
        messages = [
            SystemMessage(content="You are a software development task analyzer."),
            HumanMessage(content=prompt)
        ]
        
        response = await self.client.ainvoke(messages)
        result = self._parse_response(response.content)
        
        # Cache result
        await self.cache.set(cache_key, result, ttl=3600)
        
        return result

    async def decompose_task(self, description: str) -> Dict:
        """Decompose task into phases and sub-tasks"""
        cache_key = f"claude:decompose:{hash(description)}"
        
        cached = await self.cache.get(cache_key)
        if cached:
            return cached
        
        prompt = f"""Decompose this development task into executable phases:

Task: {description}

For each phase, specify:
- Phase number and name
- Whether it can run in parallel
- List of sub-tasks
- Dependencies between tasks
- Which agent should handle each task

Respond in JSON format with this structure:
{{
  "phases": [
    {{
      "number": 1,
      "name": "Phase name",
      "parallel": false,
      "tasks": [
        {{
          "id": "task-1",
          "agent": "implement",
          "description": "Task description",
          "dependencies": []
        }}
      ]
    }}
  ]
}}"""
        
        messages = [
            SystemMessage(content="You are an expert at decomposing software development tasks."),
            HumanMessage(content=prompt)
        ]
        
        response = await self.client.ainvoke(messages)
        result = self._parse_response(response.content)
        
        await self.cache.set(cache_key, result, ttl=1800)
        
        return result

    async def generate_code(self, task: Dict, context: Optional[str] = None) -> str:
        """Generate code for a task"""
        prompt = f"""Generate code for this task:

Task: {task['description']}
Agent: {task.get('agent', 'implement')}
File: {task.get('file', 'N/A')}

{context or ''}

Provide complete, production-ready code."""
        
        messages = [
            SystemMessage(content="You are an expert software developer."),
            HumanMessage(content=prompt)
        ]
        
        response = await self.client.ainvoke(messages)
        return response.content

    def _parse_response(self, content: str) -> Dict:
        """Parse Claude response (simplified - should use proper JSON parsing)"""
        import json
        try:
            # Try to extract JSON from response
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
            elif "```" in content:
                json_start = content.find("```") + 3
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
            
            return json.loads(content)
        except:
            # Fallback: return structured response
            return {"phases": [], "complexity": "MEDIUM"}

