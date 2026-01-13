/**
 * Base Agent Class
 *
 * Abstract base class for all agents in the system.
 * Provides common functionality for AI interaction, progress reporting,
 * and error handling.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  AgentType,
  AgentTask,
  AgentResult,
  AgentProgress,
  AgentCapability,
  AGENT_CAPABILITIES
} from '../../types/agent.js';
import type { EventBus } from '../../events/EventBus.js';
import type { AIProvider } from '../../providers/base/AIProvider.js';

export interface AgentContext {
  projectPath: string;
  projectPatterns?: string;
  appTruth?: string;
  similarFiles?: Array<{ path: string; content: string }>;
  previousResults?: Map<AgentType, AgentResult>;
}

export interface AgentConfig {
  type: AgentType;
  modelProvider: AIProvider;
  eventBus: EventBus;
  defaultModel?: string;
  defaultTemperature?: number;
}

export abstract class Agent {
  protected readonly type: AgentType;
  protected readonly modelProvider: AIProvider;
  protected readonly eventBus: EventBus;
  protected readonly defaultModel: string;
  protected readonly defaultTemperature: number;

  constructor(config: AgentConfig) {
    this.type = config.type;
    this.modelProvider = config.modelProvider;
    this.eventBus = config.eventBus;
    this.defaultModel = config.defaultModel ?? 'claude-3-5-sonnet-20241022';
    this.defaultTemperature = config.defaultTemperature ?? 0.7;
  }

  /**
   * Get agent type
   */
  getType(): AgentType {
    return this.type;
  }

  /**
   * Get agent capabilities
   */
  abstract getCapabilities(): AgentCapability;

  /**
   * Execute the agent task
   */
  abstract execute(task: AgentTask): Promise<AgentResult>;

  /**
   * Validate the result before returning
   */
  async validate(result: AgentResult): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!result.success && !result.error) {
      errors.push('Failed result must include an error message');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Report progress to event bus
   */
  protected async reportProgress(
    taskId: string,
    progress: number,
    message: string
  ): Promise<void> {
    const progressEvent: AgentProgress = {
      agent: this.type,
      taskId,
      progress: Math.min(100, Math.max(0, progress)),
      message,
      timestamp: new Date()
    };

    await this.eventBus.publish('agent.progress', {
      ...progressEvent
    });
  }

  /**
   * Log message via event bus
   */
  protected async log(
    taskId: string,
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    await this.eventBus.publish('agent.log', {
      agent: this.type,
      taskId,
      level,
      message,
      data,
      timestamp: new Date()
    });
  }

  /**
   * Handle errors with proper reporting
   */
  protected async handleError(
    taskId: string,
    error: Error | unknown
  ): Promise<AgentResult> {
    const errorMessage = error instanceof Error ? error.message : String(error);

    await this.eventBus.publish('agent.failed', {
      agent: this.type,
      taskId,
      error: errorMessage,
      timestamp: new Date()
    });

    return {
      success: false,
      error: errorMessage,
      suggestions: await this.suggestFixes(errorMessage)
    };
  }

  /**
   * Suggest fixes for common errors
   */
  protected async suggestFixes(error: string): Promise<string[]> {
    const suggestions: string[] = [];

    // Common error patterns and suggestions
    if (error.includes('timeout')) {
      suggestions.push('Consider breaking the task into smaller subtasks');
      suggestions.push('Try using a faster model like claude-3-5-sonnet');
    }

    if (error.includes('rate limit')) {
      suggestions.push('Wait a moment before retrying');
      suggestions.push('Consider using local Ollama models');
    }

    if (error.includes('token limit')) {
      suggestions.push('Reduce the context size');
      suggestions.push('Break the task into smaller parts');
    }

    return suggestions;
  }

  /**
   * Get project context for code generation
   */
  protected async getProjectContext(
    projectPath: string,
    targetFile?: string
  ): Promise<AgentContext> {
    const context: AgentContext = {
      projectPath
    };

    // These would be populated by reading actual files
    // For now, return basic context structure
    return context;
  }

  /**
   * Build prompt with context
   */
  protected buildPrompt(
    template: string,
    variables: Record<string, string>
  ): string {
    let prompt = template;

    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    return prompt;
  }

  /**
   * Generate unique ID for subtasks
   */
  protected generateId(): string {
    return uuidv4();
  }

  /**
   * Estimate tokens for a prompt (rough estimation)
   */
  protected estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}

/**
 * Type guard for checking if a result is successful
 */
export function isSuccessfulResult(result: AgentResult): result is AgentResult & { success: true } {
  return result.success === true;
}

/**
 * Type guard for checking if a result has files modified
 */
export function hasFilesModified(
  result: AgentResult
): result is AgentResult & { filesModified: string[] } {
  return Array.isArray(result.filesModified) && result.filesModified.length > 0;
}
