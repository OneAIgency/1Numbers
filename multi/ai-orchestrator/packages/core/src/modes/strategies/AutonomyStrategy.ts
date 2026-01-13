/**
 * Autonomy Strategy
 *
 * Full lifecycle automation from idea to deployment.
 * No human approval required, self-healing on failures.
 */

import type {
  ModeConfig,
  ValidationConfig
} from '../../types/mode.js';
import { AgentType } from '../../types/agent.js';
import type { Phase } from '../../types/task.js';
import type {
  ModeStrategy,
  AgentSelection,
  ModelSelection,
  TaskComplexity
} from '../ModeManager.js';

export class AutonomyStrategy implements ModeStrategy {
  private config: ModeConfig;

  constructor(config: ModeConfig) {
    this.config = config;
  }

  getConfig(): ModeConfig {
    return this.config;
  }

  async decomposeTask(
    description: string,
    context?: Record<string, unknown>
  ): Promise<Phase[]> {
    return [
      {
        number: 1,
        name: 'Analysis',
        description: 'Autonomous requirement analysis',
        status: 'pending',
        parallel: false,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Analyze and understand requirements',
            agent: AgentType.CONCEPT,
            status: 'pending'
          }
        ]
      },
      {
        number: 2,
        name: 'Architecture',
        description: 'Design optimal solution architecture',
        status: 'pending',
        parallel: false,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Design architecture and components',
            agent: AgentType.ARCHITECT,
            status: 'pending'
          }
        ]
      },
      {
        number: 3,
        name: 'Implementation',
        description: 'Generate all required code',
        status: 'pending',
        parallel: true,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: `Implement: ${description}`,
            agent: AgentType.IMPLEMENT,
            status: 'pending'
          }
        ]
      },
      {
        number: 4,
        name: 'Testing',
        description: 'Create and run tests',
        status: 'pending',
        parallel: false,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Generate and execute tests',
            agent: AgentType.TEST,
            status: 'pending'
          }
        ]
      },
      {
        number: 5,
        name: 'Review & Security',
        description: 'Automated review and security check',
        status: 'pending',
        parallel: true,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Automated code review',
            agent: AgentType.REVIEW,
            status: 'pending'
          },
          {
            id: crypto.randomUUID(),
            description: 'Security analysis',
            agent: AgentType.SECURITY,
            status: 'pending'
          }
        ]
      },
      {
        number: 6,
        name: 'Optimization',
        description: 'Performance optimization',
        status: 'pending',
        parallel: false,
        required: false, // Optional in autonomy mode
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Optimize for performance',
            agent: AgentType.OPTIMIZE,
            status: 'pending'
          }
        ]
      },
      {
        number: 7,
        name: 'Documentation',
        description: 'Generate all documentation',
        status: 'pending',
        parallel: false,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Generate documentation',
            agent: AgentType.DOCS,
            status: 'pending'
          }
        ]
      },
      {
        number: 8,
        name: 'Deployment',
        description: 'Automated deployment',
        status: 'pending',
        parallel: false,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Deploy to target environment',
            agent: AgentType.DEPLOY,
            status: 'pending'
          }
        ]
      }
    ];
  }

  selectAgents(description: string): AgentSelection {
    return {
      primary: AgentType.IMPLEMENT,
      secondary: [
        AgentType.CONCEPT,
        AgentType.ARCHITECT,
        AgentType.TEST,
        AgentType.REVIEW,
        AgentType.SECURITY,
        AgentType.OPTIMIZE,
        AgentType.DOCS,
        AgentType.DEPLOY
      ],
      skip: []
    };
  }

  getValidationConfig(): ValidationConfig {
    return {
      runTypeCheck: true,
      runLint: true,
      runBuild: true,
      runTests: true,
      requireCodeReview: false, // Automated review only
      requireSecurityScan: true,
      minTestCoverage: 70
    };
  }

  selectModel(taskComplexity: TaskComplexity): ModelSelection {
    // Use Claude for complex tasks, Ollama for simpler ones (cost savings)
    if (taskComplexity === 'complex') {
      return {
        provider: this.config.primaryModel.provider,
        model: this.config.primaryModel.model,
        temperature: this.config.primaryModel.temperature,
        maxTokens: this.config.primaryModel.maxTokens
      };
    }

    if (this.config.useLocalModels) {
      return {
        provider: this.config.fallbackModel.provider,
        model: this.config.fallbackModel.model,
        temperature: this.config.fallbackModel.temperature,
        maxTokens: this.config.fallbackModel.maxTokens
      };
    }

    return {
      provider: this.config.primaryModel.provider,
      model: this.config.primaryModel.model,
      temperature: this.config.primaryModel.temperature,
      maxTokens: this.config.primaryModel.maxTokens
    };
  }

  /**
   * Self-healing: select alternative agents on failure
   */
  selectAlternativeAgents(failedAgent: AgentType): AgentType[] {
    const alternatives: Partial<Record<AgentType, AgentType[]>> = {
      [AgentType.IMPLEMENT]: [AgentType.REFACTOR],
      [AgentType.TEST]: [AgentType.DEBUG],
      [AgentType.DEPLOY]: [] // No alternative for deploy
    };

    return alternatives[failedAgent] ?? [];
  }
}
