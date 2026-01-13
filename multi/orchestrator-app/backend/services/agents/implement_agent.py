"""
Implement Agent - Generates and writes code
"""

import os
from typing import Dict, Optional
from pathlib import Path

from services.claude import ClaudeService
from services.ollama import OllamaService


class ImplementAgent:
    def __init__(self, claude_service: ClaudeService, ollama_service: OllamaService):
        self.claude_service = claude_service
        self.ollama_service = ollama_service

    async def execute(
        self,
        task: Dict,
        project_path: Optional[str] = None,
        model_preference: Optional[str] = None
    ) -> Dict:
        """
        Execute implement agent task
        
        Args:
            task: Task dictionary with description, file, etc.
            project_path: Path to project root
            model_preference: Preferred model (claude or ollama:model)
        
        Returns:
            Result dictionary with success, output, files_modified
        """
        try:
            # Determine which model to use
            use_claude = not model_preference or model_preference.startswith("claude")
            
            # Get context from project
            context = await self._get_project_context(project_path, task.get("file"))
            
            # Generate code
            if use_claude:
                code = await self.claude_service.generate_code(task, context)
            else:
                # Use Ollama
                model = model_preference.replace("ollama:", "") if model_preference else "llama2"
                prompt = self._build_code_generation_prompt(task, context)
                code = await self.ollama_service.generate(model, prompt)
            
            # Write code to file if file path specified
            files_modified = []
            if task.get("file"):
                file_path = Path(project_path or ".") / task["file"]
                await self._write_file(file_path, code)
                files_modified.append(str(file_path))
            
            return {
                "success": True,
                "output": code,
                "files_modified": files_modified,
                "model_used": "claude" if use_claude else model_preference
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "files_modified": []
            }

    async def _get_project_context(self, project_path: Optional[str], file_path: Optional[str]) -> str:
        """Get relevant context from project"""
        context_parts = []
        
        if not project_path:
            return ""
        
        project_root = Path(project_path)
        
        # Read app-truth.md if exists
        app_truth = project_root / "app-truth.md"
        if app_truth.exists():
            context_parts.append(f"Project Rules:\n{app_truth.read_text()[:2000]}")
        
        # Read related files if file_path specified
        if file_path:
            target_file = project_root / file_path
            if target_file.exists():
                # Read existing file for context
                context_parts.append(f"Existing file:\n{target_file.read_text()[:1000]}")
            
            # Read similar files in same directory
            if target_file.parent.exists():
                similar_files = list(target_file.parent.glob("*.ts"))[:3]
                for sf in similar_files:
                    if sf != target_file:
                        context_parts.append(f"Similar file {sf.name}:\n{sf.read_text()[:500]}")
        
        return "\n\n".join(context_parts)

    def _build_code_generation_prompt(self, task: Dict, context: str) -> str:
        """Build prompt for code generation"""
        return f"""Generate production-ready code for this task:

Task: {task['description']}
Agent: {task.get('agent', 'implement')}
File: {task.get('file', 'N/A')}

{context}

Requirements:
- Follow TypeScript/React best practices
- Use proper types (no 'any' without justification)
- Add JSDoc comments for functions
- Follow existing code patterns
- Ensure code compiles without errors

Provide complete, production-ready code."""
    
    async def _write_file(self, file_path: Path, content: str):
        """Write code to file"""
        # Create directory if needed
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write file
        file_path.write_text(content, encoding="utf-8")

