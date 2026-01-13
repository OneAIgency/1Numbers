"""
Test Agent - Runs and creates tests
"""

import subprocess
from typing import Dict, Optional
from pathlib import Path


class TestAgent:
    def __init__(self, project_path: Optional[str] = None):
        self.project_path = Path(project_path) if project_path else Path.cwd()

    async def execute(self, task: Dict, test_file: Optional[str] = None) -> Dict:
        """
        Execute test agent
        
        Args:
            task: Task dictionary
            test_file: Specific test file to run (optional)
        
        Returns:
            Test result
        """
        try:
            # Run tests
            if test_file:
                result = await self._run_specific_test(test_file)
            else:
                result = await self._run_all_tests()
            
            return {
                "success": result["success"],
                "output": result["output"],
                "tests_passed": result.get("tests_passed", 0),
                "tests_failed": result.get("tests_failed", 0),
                "coverage": result.get("coverage", {})
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "tests_passed": 0,
                "tests_failed": 0
            }

    async def _run_all_tests(self) -> Dict:
        """Run all tests"""
        try:
            result = subprocess.run(
                ["npm", "run", "test:run"],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            output = result.stdout + result.stderr
            
            # Parse test results (basic)
            tests_passed = output.count("✓") or output.count("PASS")
            tests_failed = output.count("✗") or output.count("FAIL")
            
            return {
                "success": result.returncode == 0,
                "output": output,
                "tests_passed": tests_passed,
                "tests_failed": tests_failed
            }
        except Exception as e:
            return {
                "success": False,
                "output": str(e),
                "tests_passed": 0,
                "tests_failed": 0
            }

    async def _run_specific_test(self, test_file: str) -> Dict:
        """Run specific test file"""
        try:
            result = subprocess.run(
                ["npm", "run", "test:run", "--", test_file],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            output = result.stdout + result.stderr
            tests_passed = output.count("✓") or output.count("PASS")
            tests_failed = output.count("✗") or output.count("FAIL")
            
            return {
                "success": result.returncode == 0,
                "output": output,
                "tests_passed": tests_passed,
                "tests_failed": tests_failed
            }
        except Exception as e:
            return {
                "success": False,
                "output": str(e),
                "tests_passed": 0,
                "tests_failed": 0
            }

