/**
 * Cost Strategy
 *
 * Optimized for minimal API costs.
 * Prefers local Ollama models, falls back to cheapest Claude model.
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

export class CostStrategy implements ModeStrategy {
  private config: ModeConfig;
  private currentCost: number = 0;

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
    // Minimal phases to reduce API calls
    return [
      {
        number: 1,
        name: 'Implementation',
        description: 'Cost-efficient implementation',
        status: 'pending',
        parallel: false, // Sequential to avoid parallel API costs
        required: true,
        tasks: [
          {
            id: crypto.randomUUID(),
            description,
            agent: AgentType.IMPLEMENT,
            status: 'pending',
            model: this.config.primaryModel.model // Use local model
          }
        ]
      },
      {
        number: 2,
        name: 'Basic Verification',
        description: 'Minimal verification',
        status: 'pending',
        parallel: false,
        required: false,
        tasks: [
          {
            id: crypto.randomUUID(),
            description: 'Basic testing',
            agent: AgentType.TEST,
            status: 'pending',
            model: this.config.primaryModel.model
          }
        ]
      }
    ];
  }

  selectAgents(description: string): AgentSelection {
    return {
      primary: AgentType.IMPLEMENT,
      secondary: [AgentType.TEST],
      skip: [
        AgentType.CONCEPT,
        AgentType.ARCHITECT,
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
      runTypeCheck: false, // Skip to save time/resources
      runLint: false,
      runBuild: true, // Essential check
      runTests: false, // Optional
      requireCodeReview: false,
      requireSecurityScan: false
    };
  }

  selectModel(taskComplexity: TaskComplexity): ModelSelection {
    // Always try local model first
    if (taskComplexity === 'simple') {
      return {
        provider: 'ollama',
        model: 'codellama:7b',
        temperature: 0.7,
        maxTokens: 2048
      };
    }

    if (taskComplexity === 'medium') {
      return {
        provider: 'ollama',
        model: 'codellama:13b',
        temperature: 0.6,
        maxTokens: 3000
      };
    }

    // Complex tasks: use cheapest Claude model
    return {
      provider: 'claude',
      model: 'claude-3-5-haiku-20241022',
      temperature: 0.5,
      maxTokens: 4096
    };
  }

  /**
   * Check if we should continue based on cost limit
   */
  shouldContinue(currentCost: number): boolean {
    this.currentCost = currentCost;

    if (this.config.costLimit === undefined) {
      return true;
    }

    return currentCost < this.config.costLimit;
  }

  /**
   * Get remaining budget
   */
  getRemainingBudget(): number | undefined {
    if (this.config.costLimit === undefined) {
      return undefined;
    }

    return Math.max(0, this.config.costLimit - this.currentCost);
  }

  /**
   * Estimate cost for a task
   */
  estimateCost(tokensInput: number, tokensOutput: number, model: string): number {
    // Pricing per 1K tokens
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-3-5-haiku-20241022': { input: 0.0008, output: 0.004 },
      'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
      'codellama:7b': { input: 0, output: 0 }, // Local model
      'codellama:13b': { input: 0, output: 0 },
      'codellama:34b': { input: 0, output: 0 }
    };

    const modelPricing = pricing[model] ?? { input: 0, output: 0 };

    return (
      (tokensInput / 1000) * modelPricing.input +
      (tokensOutput / 1000) * modelPricing.output
    );
  }
}
