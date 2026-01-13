/**
 * Speed Strategy
 *
 * Optimized for fast code generation with minimal validation.
 * Use when time is critical and manual review is acceptable.
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

export class SpeedStrategy implements ModeStrategy {
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
    // Minimal decomposition - single phase execution
    return [
      {
        number: 1,
        name: 'Rapid Implementation',
        description: 'Quick implementation with minimal overhead',
        status: 'pending',
        parallel: true,
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description,
            agent: AgentType.IMPLEMENT,
            status: 'pending'
          }
        ]
      },
      {
        number: 2,
        name: 'Quick Verification',
        description: 'Basic build check',
        status: 'pending',
        parallel: false,
        required: false, // Not strictly required
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Verify build passes',
            agent: AgentType.IMPLEMENT, // Use implement agent for quick check
            status: 'pending'
          }
        ]
      }
    ];
  }

  selectAgents(description: string): AgentSelection {
    return {
      primary: AgentType.IMPLEMENT,
      secondary: [],
      skip: [
        AgentType.CONCEPT,
        AgentType.ARCHITECT,
        AgentType.TEST,
        AgentType.REVIEW,
        AgentType.SECURITY,
        AgentType.OPTIMIZE,
        AgentType.DOCS,
        AgentType.DEPLOY
      ]
    };
  }

  getValidationConfig(): ValidationConfig {
    return {
      runTypeCheck: false,
      runLint: false,
      runBuild: true, // Only check if it builds
      runTests: false,
      requireCodeReview: false,
      requireSecurityScan: false
    };
  }

  selectModel(taskComplexity: TaskComplexity): ModelSelection {
    // Use faster models regardless of complexity
    return {
      provider: this.config.primaryModel.provider,
      model: this.config.primaryModel.model,
      temperature: this.config.primaryModel.temperature,
      maxTokens: this.config.primaryModel.maxTokens
    };
  }
}
