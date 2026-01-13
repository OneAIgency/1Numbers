/**
 * Mode Manager
 *
 * Central manager for execution modes. Handles mode switching,
 * strategy selection, and configuration management.
 */

import {
  ExecutionMode,
  DEFAULT_MODE_CONFIGS,
  type ModeConfig,
  type ValidationConfig
} from '../types/mode.js';
import type { AgentType } from '../types/agent.js';
import type { Phase } from '../types/task.js';
import type { EventBus } from '../events/EventBus.js';

export interface ModeStrategy {
  getConfig(): ModeConfig;
  decomposeTask(description: string, context?: Record<string, unknown>): Promise<Phase[]>;
  selectAgents(description: string): AgentSelection;
  getValidationConfig(): ValidationConfig;
  selectModel(taskComplexity: TaskComplexity): ModelSelection;
  shouldContinue?(currentCost: number): boolean;
}

export interface AgentSelection {
  primary: AgentType;
  secondary: AgentType[];
  skip: AgentType[];
}

export interface ModelSelection {
  provider: 'claude' | 'ollama';
  model: string;
  temperature: number;
  maxTokens: number;
}

export type TaskComplexity = 'simple' | 'medium' | 'complex';

export interface ModeManagerConfig {
  eventBus: EventBus;
  defaultMode?: ExecutionMode;
  customConfigs?: Partial<Record<ExecutionMode, Partial<ModeConfig>>>;
}

export class ModeManager {
  private currentMode: ExecutionMode;
  private strategies: Map<ExecutionMode, ModeStrategy> = new Map();
  private configs: Map<ExecutionMode, ModeConfig> = new Map();
  private eventBus: EventBus;
  private isTransitioning: boolean = false;

  constructor(config: ModeManagerConfig) {
    this.eventBus = config.eventBus;
    this.currentMode = config.defaultMode ?? ExecutionMode.QUALITY;

    // Initialize configs with defaults and custom overrides
    for (const mode of Object.values(ExecutionMode)) {
      const defaultConfig = DEFAULT_MODE_CONFIGS[mode];
      const customConfig = config.customConfigs?.[mode];
      this.configs.set(mode, { ...defaultConfig, ...customConfig });
    }

    // Initialize strategies
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    const { SpeedStrategy } = require('./strategies/SpeedStrategy.js');
    const { QualityStrategy } = require('./strategies/QualityStrategy.js');
    const { AutonomyStrategy } = require('./strategies/AutonomyStrategy.js');
    const { CostStrategy } = require('./strategies/CostStrategy.js');

    this.strategies.set(ExecutionMode.SPEED, new SpeedStrategy(this.configs.get(ExecutionMode.SPEED)!));
    this.strategies.set(ExecutionMode.QUALITY, new QualityStrategy(this.configs.get(ExecutionMode.QUALITY)!));
    this.strategies.set(ExecutionMode.AUTONOMY, new AutonomyStrategy(this.configs.get(ExecutionMode.AUTONOMY)!));
    this.strategies.set(ExecutionMode.COST, new CostStrategy(this.configs.get(ExecutionMode.COST)!));
  }

  /**
   * Get current execution mode
   */
  getCurrentMode(): ExecutionMode {
    return this.currentMode;
  }

  /**
   * Get current strategy
   */
  getCurrentStrategy(): ModeStrategy {
    const strategy = this.strategies.get(this.currentMode);
    if (!strategy) {
      throw new Error(`No strategy found for mode: ${this.currentMode}`);
    }
    return strategy;
  }

  /**
   * Get config for a mode
   */
  getConfig(mode?: ExecutionMode): ModeConfig {
    const config = this.configs.get(mode ?? this.currentMode);
    if (!config) {
      throw new Error(`No config found for mode: ${mode ?? this.currentMode}`);
    }
    return config;
  }

  /**
   * Update config for a mode
   */
  async updateConfig(mode: ExecutionMode, updates: Partial<ModeConfig>): Promise<void> {
    const currentConfig = this.configs.get(mode);
    if (!currentConfig) {
      throw new Error(`No config found for mode: ${mode}`);
    }

    const newConfig = { ...currentConfig, ...updates };
    this.configs.set(mode, newConfig);

    // Re-initialize strategy with new config
    this.reinitializeStrategy(mode, newConfig);

    await this.eventBus.publish('mode.config.updated', {
      mode,
      updates
    });
  }

  private reinitializeStrategy(mode: ExecutionMode, config: ModeConfig): void {
    const { SpeedStrategy } = require('./strategies/SpeedStrategy.js');
    const { QualityStrategy } = require('./strategies/QualityStrategy.js');
    const { AutonomyStrategy } = require('./strategies/AutonomyStrategy.js');
    const { CostStrategy } = require('./strategies/CostStrategy.js');

    switch (mode) {
      case ExecutionMode.SPEED:
        this.strategies.set(mode, new SpeedStrategy(config));
        break;
      case ExecutionMode.QUALITY:
        this.strategies.set(mode, new QualityStrategy(config));
        break;
      case ExecutionMode.AUTONOMY:
        this.strategies.set(mode, new AutonomyStrategy(config));
        break;
      case ExecutionMode.COST:
        this.strategies.set(mode, new CostStrategy(config));
        break;
    }
  }

  /**
   * Switch to a different mode
   */
  async switchMode(newMode: ExecutionMode): Promise<void> {
    if (this.isTransitioning) {
      throw new Error('Mode switch already in progress');
    }

    if (newMode === this.currentMode) {
      return; // No change needed
    }

    this.isTransitioning = true;

    try {
      // Notify about mode switching
      await this.eventBus.publish('mode.switching', {
        from: this.currentMode,
        to: newMode
      });

      const previousMode = this.currentMode;
      this.currentMode = newMode;

      // Notify about mode switched
      await this.eventBus.publish('mode.switched', {
        fromMode: previousMode,
        toMode: newMode,
        affectedTasks: 0 // Will be updated by orchestrator
      });
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Check if mode is transitioning
   */
  isInTransition(): boolean {
    return this.isTransitioning;
  }

  /**
   * Get all available modes
   */
  getAvailableModes(): ExecutionMode[] {
    return Object.values(ExecutionMode);
  }

  /**
   * Get all mode configs
   */
  getAllConfigs(): Map<ExecutionMode, ModeConfig> {
    return new Map(this.configs);
  }

  /**
   * Decompose task using current strategy
   */
  async decomposeTask(
    description: string,
    context?: Record<string, unknown>
  ): Promise<Phase[]> {
    const strategy = this.getCurrentStrategy();
    return strategy.decomposeTask(description, context);
  }

  /**
   * Select agents using current strategy
   */
  selectAgents(description: string): AgentSelection {
    const strategy = this.getCurrentStrategy();
    return strategy.selectAgents(description);
  }

  /**
   * Get validation config using current strategy
   */
  getValidationConfig(): ValidationConfig {
    const strategy = this.getCurrentStrategy();
    return strategy.getValidationConfig();
  }

  /**
   * Select model using current strategy
   */
  selectModel(taskComplexity: TaskComplexity): ModelSelection {
    const strategy = this.getCurrentStrategy();
    return strategy.selectModel(taskComplexity);
  }

  /**
   * Estimate complexity from description
   */
  estimateComplexity(description: string): TaskComplexity {
    const lowKeywords = ['fix', 'update', 'change', 'modify', 'rename', 'remove'];
    const mediumKeywords = ['add', 'create', 'implement', 'feature', 'component'];
    const highKeywords = ['refactor', 'architecture', 'system', 'migrate', 'redesign', 'rebuild'];

    const lowerDesc = description.toLowerCase();

    if (highKeywords.some(kw => lowerDesc.includes(kw))) {
      return 'complex';
    }

    if (mediumKeywords.some(kw => lowerDesc.includes(kw))) {
      return 'medium';
    }

    if (lowKeywords.some(kw => lowerDesc.includes(kw))) {
      return 'simple';
    }

    // Default to medium for unknown patterns
    return 'medium';
  }
}

// Singleton instance
let modeManagerInstance: ModeManager | null = null;

export function getModeManager(config?: ModeManagerConfig): ModeManager {
  if (!modeManagerInstance) {
    if (!config) {
      throw new Error('ModeManager config required for initialization');
    }
    modeManagerInstance = new ModeManager(config);
  }
  return modeManagerInstance;
}

export function resetModeManager(): void {
  modeManagerInstance = null;
}
