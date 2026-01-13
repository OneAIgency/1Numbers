/**
 * Quality Strategy
 *
 * Optimized for code correctness with comprehensive validation.
 * All lifecycle agents participate, human approval required.
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

export class QualityStrategy implements ModeStrategy {
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
        name: 'Conceptualization',
        description: 'Analyze requirements and design solution',
        status: 'pending',
        parallel: false,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Analyze requirements and success criteria',
            agent: AgentType.CONCEPT,
            status: 'pending'
          },
          {
            id: crypto.randomUUID(),
            description: 'Design technical architecture',
            agent: AgentType.ARCHITECT,
            status: 'pending',
            dependencies: [] // Will be set to concept task ID
          }
        ]
      },
      {
        number: 2,
        name: 'Implementation',
        description: 'Generate production-ready code',
        status: 'pending',
        parallel: true,
        required: true,
        tasks: this.generateImplementationTasks(description)
      },
      {
        number: 3,
        name: 'Testing & Review',
        description: 'Comprehensive testing and code review',
        status: 'pending',
        parallel: true,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Create and run comprehensive tests',
            agent: AgentType.TEST,
            status: 'pending'
          },
          {
            id: crypto.randomUUID(),
            description: 'Perform code review',
            agent: AgentType.REVIEW,
            status: 'pending'
          },
          {
            id: crypto.randomUUID(),
            description: 'Security audit',
            agent: AgentType.SECURITY,
            status: 'pending'
          }
        ]
      },
      {
        number: 4,
        name: 'Documentation',
        description: 'Generate comprehensive documentation',
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
      }
    ];
  }

  private generateImplementationTasks(description: string): Array<{
    id: string;
    description: string;
    agent: AgentType;
    status: 'pending';
  }> {
    // Base implementation task
    const tasks = [
      {
        id: crypto.randomUUID(),
        description: `Implement: ${description}`,
        agent: AgentType.IMPLEMENT,
        status: 'pending' as const
      }
    ];

    // Add translation task if description mentions multilingual or UI
    if (
      description.toLowerCase().includes('ui') ||
      description.toLowerCase().includes('translation') ||
      description.toLowerCase().includes('multilingual')
    ) {
      tasks.push({
        id: crypto.randomUUID(),
        description: 'Add translations (RO/EN/RU)',
        agent: AgentType.IMPLEMENT,
        status: 'pending' as const
      });
    }

    return tasks;
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
        AgentType.DOCS
      ],
      skip: [AgentType.DEPLOY] // Deploy is manual in quality mode
    };
  }

  getValidationConfig(): ValidationConfig {
    return {
      runTypeCheck: true,
      runLint: true,
      runBuild: true,
      runTests: true,
      requireCodeReview: true,
      requireSecurityScan: true,
      minTestCoverage: 80
    };
  }

  selectModel(taskComplexity: TaskComplexity): ModelSelection {
    // Use Opus for all tasks in quality mode
    return {
      provider: this.config.primaryModel.provider,
      model: this.config.primaryModel.model,
      temperature: this.config.primaryModel.temperature,
      maxTokens: this.config.primaryModel.maxTokens
    };
  }
}
