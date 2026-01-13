/**
 * Task Decomposer
 * Analyzes tasks and breaks them into executable sub-tasks
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { ExecutionPlan, Task, TaskPhase } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class TaskDecomposer {
  private agentDefinitions: Map<string, any> = new Map();

  /**
   * Decompose a task into an execution plan
   */
  async decompose(taskDescription: string): Promise<ExecutionPlan> {
    // Load agent definitions
    await this.loadAgentDefinitions();

    // Analyze task complexity
    const complexity = this.analyzeComplexity(taskDescription);

    // Generate phases based on complexity
    const phases = await this.generatePhases(taskDescription, complexity);

    return {
      taskDescription,
      phases,
      totalTasks: phases.reduce((sum, phase) => sum + phase.tasks.length, 0),
      estimatedTime: this.estimateTime(phases),
    };
  }

  /**
   * Load agent definitions from .claude/agents/
   */
  private async loadAgentDefinitions(): Promise<void> {
    const agentsDir = join(__dirname, '../../agents');
    const agents = ['implement', 'verify', 'test', 'docs', 'numerology-expert', 'creative', 'optimize'];

    for (const agent of agents) {
      try {
        const content = await readFile(join(agentsDir, `${agent}.md`), 'utf-8');
        this.agentDefinitions.set(agent, this.parseAgentDefinition(content));
      } catch (error) {
        console.warn(`Warning: Could not load agent definition for ${agent}`);
      }
    }
  }

  /**
   * Parse agent definition markdown
   */
  private parseAgentDefinition(content: string): any {
    // Simple parsing - extract key sections
    return {
      content,
      // TODO: More sophisticated parsing
    };
  }

  /**
   * Analyze task complexity
   */
  private analyzeComplexity(taskDescription: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const keywords = {
      LOW: ['fix', 'update', 'change', 'modify'],
      MEDIUM: ['add', 'create', 'implement', 'feature'],
      HIGH: ['refactor', 'architecture', 'system', 'migrate'],
    };

    const lowerDesc = taskDescription.toLowerCase();
    
    for (const [level, words] of Object.entries(keywords)) {
      if (words.some(word => lowerDesc.includes(word))) {
        return level as 'LOW' | 'MEDIUM' | 'HIGH';
      }
    }

    return 'MEDIUM';
  }

  /**
   * Generate execution phases
   */
  private async generatePhases(
    taskDescription: string,
    complexity: 'LOW' | 'MEDIUM' | 'HIGH'
  ): Promise<TaskPhase[]> {
    const phases: TaskPhase[] = [];

    // Simple heuristic-based phase generation
    // In a real implementation, this would use AI/LLM to analyze the task

    if (complexity === 'LOW') {
      // Single phase, sequential
      phases.push({
        number: 1,
        name: 'Implementation',
        parallel: false,
        tasks: [
          {
            id: 'task-1',
            agent: 'implement',
            description: taskDescription,
          },
        ],
      });
    } else if (complexity === 'MEDIUM') {
      // Two phases: implementation + verification
      phases.push({
        number: 1,
        name: 'Implementation',
        parallel: false,
        tasks: [
          {
            id: 'task-1',
            agent: 'implement',
            description: taskDescription,
          },
        ],
      });
      phases.push({
        number: 2,
        name: 'Verification',
        parallel: false,
        tasks: [
          {
            id: 'task-2',
            agent: 'verify',
            description: 'Verify implementation',
            dependencies: ['task-1'],
          },
        ],
      });
    } else {
      // Multiple phases with parallelization
      phases.push({
        number: 1,
        name: 'Analysis & Planning',
        parallel: false,
        tasks: [
          {
            id: 'task-1',
            agent: 'implement',
            description: `Analyze: ${taskDescription}`,
          },
        ],
      });
      phases.push({
        number: 2,
        name: 'Implementation',
        parallel: true,
        tasks: [
          {
            id: 'task-2',
            agent: 'implement',
            description: `Implement core logic for: ${taskDescription}`,
            dependencies: ['task-1'],
          },
          {
            id: 'task-3',
            agent: 'implement',
            description: `Add translations for: ${taskDescription}`,
            dependencies: ['task-1'],
          },
        ],
      });
      phases.push({
        number: 3,
        name: 'Verification & Testing',
        parallel: true,
        tasks: [
          {
            id: 'task-4',
            agent: 'verify',
            description: 'Verify implementation',
            dependencies: ['task-2', 'task-3'],
          },
          {
            id: 'task-5',
            agent: 'test',
            description: 'Run tests',
            dependencies: ['task-2'],
          },
        ],
      });
    }

    return phases;
  }

  /**
   * Estimate execution time
   */
  private estimateTime(phases: TaskPhase[]): number {
    // Simple estimation: 5 min per task, parallel tasks count as max duration
    let totalMinutes = 0;

    for (const phase of phases) {
      if (phase.parallel) {
        // Parallel phase: take max duration
        totalMinutes += 5; // Assume 5 min per parallel batch
      } else {
        // Sequential phase: sum durations
        totalMinutes += phase.tasks.length * 5;
      }
    }

    return totalMinutes;
  }
}

