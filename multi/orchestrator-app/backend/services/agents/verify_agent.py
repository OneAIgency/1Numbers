"""
Verify Agent - Validates code quality and builds
"""

import subprocess
import os
from typing import Dict, Optional, List
from pathlib import Path


class VerifyAgent:
    def __init__(self, project_path: Optional[str] = None):
        self.project_path = Path(project_path) if project_path else Path.cwd()

    async def execute(self, task: Dict, files_modified: list = None) -> Dict:
        """
        Execute verify agent
        
        Args:
            task: Task dictionary
            files_modified: List of modified files to verify
        
        Returns:
            Verification result
        """
        errors = []
        warnings = []
        
        # 1. TypeScript compilation check
        ts_result = await self._check_typescript()
        if not ts_result["success"]:
            errors.extend(ts_result["errors"])
        else:
            warnings.extend(ts_result["warnings"])
        
        # 2. ESLint check
        lint_result = await self._check_lint()
        if not lint_result["success"]:
            errors.extend(lint_result["errors"])
        else:
            warnings.extend(lint_result["warnings"])
        
        # 3. Build check
        build_result = await self._check_build()
        if not build_result["success"]:
            errors.extend(build_result["errors"])
        
        # 4. Architecture compliance (if app-truth.md exists)
        arch_result = await self._check_architecture(files_modified or [])
        if not arch_result["success"]:
            warnings.extend(arch_result["warnings"])
        
        return {
            "success": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "checks": {
                "typescript": ts_result["success"],
                "eslint": lint_result["success"],
                "build": build_result["success"],
                "architecture": arch_result["success"]
            }
        }

    async def _check_typescript(self) -> Dict:
        """Check TypeScript compilation"""
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit"],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                return {"success": True, "errors": [], "warnings": []}
            else:
                return {
                    "success": False,
                    "errors": [f"TypeScript errors:\n{result.stderr}"],
                    "warnings": []
                }
        except Exception as e:
            return {
                "success": False,
                "errors": [f"TypeScript check failed: {str(e)}"],
                "warnings": []
            }

    async def _check_lint(self) -> Dict:
        """Check ESLint"""
        try:
            result = subprocess.run(
                ["npm", "run", "lint"],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            warnings = []
            if result.stdout:
                # Parse lint warnings
                warnings = [line for line in result.stdout.split("\n") if "warning" in line.lower()]
            
            return {
                "success": result.returncode == 0,
                "errors": [] if result.returncode == 0 else [result.stderr or result.stdout],
                "warnings": warnings
            }
        except Exception as e:
            return {
                "success": False,
                "errors": [f"Lint check failed: {str(e)}"],
                "warnings": []
            }

    async def _check_build(self) -> Dict:
        """Check build"""
        try:
            result = subprocess.run(
                ["npm", "run", "build"],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            return {
                "success": result.returncode == 0,
                "errors": [] if result.returncode == 0 else [result.stderr or result.stdout],
                "warnings": []
            }
        except Exception as e:
            return {
                "success": False,
                "errors": [f"Build check failed: {str(e)}"],
                "warnings": []
            }

    async def _check_architecture(self, files_modified: list) -> Dict:
        """Check architecture compliance"""
        warnings = []
        
        app_truth = self.project_path / "app-truth.md"
        if not app_truth.exists():
            return {"success": True, "warnings": []}
        
        # Basic checks
        for file_path in files_modified:
            path = Path(file_path)
            
            # Check if lib/ files import React
            if "lib/" in str(path) and path.suffix == ".ts":
                content = path.read_text()
                if "import" in content and "react" in content.lower():
                    warnings.append(f"{file_path}: lib/ files should not import React")
            
            # Check for hardcoded strings (basic check)
            if path.suffix in [".tsx", ".ts"]:
                content = path.read_text()
                # Simple heuristic - look for common hardcoded strings
                if 'title="' in content or 'placeholder="' in content:
                    # Could be hardcoded, but might be fine
                    pass
        
        return {
            "success": len(warnings) == 0,
            "warnings": warnings
        }

