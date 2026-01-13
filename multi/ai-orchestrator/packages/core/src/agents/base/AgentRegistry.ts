/**
 * Agent Registry
 *
 * Central registry for all agents. Manages agent lifecycle,
 * dependency resolution, and execution coordination.
 */

import {
  AgentType,
  type AgentTask,
  type AgentResult,
  type AgentCapability
} from '../../types/agent.js';
import type { Agent } from './Agent.js';

export interface AgentRegistryConfig {
  maxConcurrentAgents?: number;
}

export class AgentRegistry {
  private agents: Map<AgentType, Agent> = new Map();
  private readonly maxConcurrentAgents: number;
  private activeAgents: Set<AgentType> = new Set();

  // Agent dependencies - which agents depend on outputs from other agents
  private static readonly DEPENDENCIES: Partial<Record<AgentType, AgentType[]>> = {
    [AgentType.ARCHITECT]: [AgentType.CONCEPT],
    [AgentType.IMPLEMENT]: [AgentType.ARCHITECT],
    [AgentType.TEST]: [AgentType.IMPLEMENT],
    [AgentType.REVIEW]: [AgentType.IMPLEMENT],
    [AgentType.SECURITY]: [AgentType.IMPLEMENT],
    [AgentType.OPTIMIZE]: [AgentType.IMPLEMENT, AgentType.TEST],
    [AgentType.DOCS]: [AgentType.IMPLEMENT],
    [AgentType.DEPLOY]: [AgentType.TEST, AgentType.REVIEW]
  };

  constructor(config: AgentRegistryConfig = {}) {
    this.maxConcurrentAgents = config.maxConcurrentAgents ?? 4;
  }

  /**
   * Register an agent
   */
  register(agent: Agent): void {
    const type = agent.getType();
    if (this.agents.has(type)) {
      throw new Error(`Agent ${type} is already registered`);
    }
    this.agents.set(type, agent);
  }

  /**
   * Unregister an agent
   */
  unregister(type: AgentType): boolean {
    if (this.activeAgents.has(type)) {
      throw new Error(`Cannot unregister active agent ${type}`);
    }
    return this.agents.delete(type);
  }

  /**
   * Get an agent by type
   */
  get(type: AgentType): Agent | undefined {
    return this.agents.get(type);
  }

  /**
   * Check if an agent is registered
   */
  has(type: AgentType): boolean {
    return this.agents.has(type);
  }

  /**
   * Get all registered agent types
   */
  getRegisteredTypes(): AgentType[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Get capabilities for all registered agents
   */
  getAllCapabilities(): AgentCapability[] {
    return Array.from(this.agents.values()).map(agent => agent.getCapabilities());
  }

  /**
   * Get dependencies for an agent type
   */
  getDependencies(type: AgentType): AgentType[] {
    return AgentRegistry.DEPENDENCIES[type] ?? [];
  }

  /**
   * Check if all dependencies are satisfied
   */
  areDependenciesSatisfied(
    type: AgentType,
    completedAgents: Set<AgentType>
  ): boolean {
    const deps = this.getDependencies(type);
    return deps.every(dep => completedAgents.has(dep));
  }

  /**
   * Get agents that can be executed (dependencies satisfied)
   */
  getAvailableAgents(
    requiredAgents: AgentType[],
    completedAgents: Set<AgentType>
  ): AgentType[] {
    return requiredAgents.filter(type =>
      !completedAgents.has(type) &&
      !this.activeAgents.has(type) &&
      this.areDependenciesSatisfied(type, completedAgents)
    );
  }

  /**
   * Execute an agent with dependency injection
   */
  async executeWithDependencies(
    type: AgentType,
    task: AgentTask,
    previousResults: Map<AgentType, AgentResult>
  ): Promise<AgentResult> {
    const agent = this.agents.get(type);
    if (!agent) {
      throw new Error(`Agent ${type} is not registered`);
    }

    // Check concurrent limit
    if (this.activeAgents.size >= this.maxConcurrentAgents) {
      throw new Error(`Maximum concurrent agents (${this.maxConcurrentAgents}) reached`);
    }

    // Inject dependency results into task context
    const deps = this.getDependencies(type);
    const enrichedTask: AgentTask = {
      ...task,
      context: { ...task.context },
      previousResults
    };

    for (const dep of deps) {
      const depResult = previousResults.get(dep);
      if (depResult) {
        enrichedTask.context[`${dep}Result`] = depResult.output;
      }
    }

    // Mark agent as active
    this.activeAgents.add(type);

    try {
      const result = await agent.execute(enrichedTask);

      // Validate result
      const validation = await agent.validate(result);
      if (!validation.valid) {
        return {
          ...result,
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      return result;
    } finally {
      // Mark agent as inactive
      this.activeAgents.delete(type);
    }
  }

  /**
   * Execute multiple agents in parallel
   */
  async executeParallel(
    types: AgentType[],
    task: AgentTask,
    previousResults: Map<AgentType, AgentResult>
  ): Promise<Map<AgentType, AgentResult>> {
    const results = new Map<AgentType, AgentResult>();

    // Filter to only available agents (respecting concurrency limit)
    const availableSlots = this.maxConcurrentAgents - this.activeAgents.size;
    const agentsToRun = types.slice(0, availableSlots);

    const promises = agentsToRun.map(async type => {
      try {
        const result = await this.executeWithDependencies(type, task, previousResults);
        return { type, result };
      } catch (error) {
        return {
          type,
          result: {
            success: false,
            error: error instanceof Error ? error.message : String(error)
          }
        };
      }
    });

    const settled = await Promise.allSettled(promises);

    for (const outcome of settled) {
      if (outcome.status === 'fulfilled') {
        results.set(outcome.value.type, outcome.value.result);
      }
    }

    return results;
  }

  /**
   * Get execution order for a set of agents
   * Returns agents grouped by execution level (parallel groups)
   */
  getExecutionOrder(requiredAgents: AgentType[]): AgentType[][] {
    const levels: AgentType[][] = [];
    const completed = new Set<AgentType>();
    const remaining = new Set(requiredAgents);

    while (remaining.size > 0) {
      const currentLevel: AgentType[] = [];

      for (const type of remaining) {
        if (this.areDependenciesSatisfied(type, completed)) {
          currentLevel.push(type);
        }
      }

      if (currentLevel.length === 0 && remaining.size > 0) {
        // Circular dependency or missing dependency
        throw new Error(
          `Cannot resolve execution order. Remaining agents: ${Array.from(remaining).join(', ')}`
        );
      }

      levels.push(currentLevel);

      for (const type of currentLevel) {
        remaining.delete(type);
        completed.add(type);
      }
    }

    return levels;
  }

  /**
   * Get number of active agents
   */
  getActiveCount(): number {
    return this.activeAgents.size;
  }

  /**
   * Check if any agents are active
   */
  hasActiveAgents(): boolean {
    return this.activeAgents.size > 0;
  }

  /**
   * Clear all agents (for testing)
   */
  clear(): void {
    if (this.activeAgents.size > 0) {
      throw new Error('Cannot clear registry while agents are active');
    }
    this.agents.clear();
  }
}

// Singleton instance
let registryInstance: AgentRegistry | null = null;

export function getAgentRegistry(config?: AgentRegistryConfig): AgentRegistry {
  if (!registryInstance) {
    registryInstance = new AgentRegistry(config);
  }
  return registryInstance;
}

export function resetAgentRegistry(): void {
  if (registryInstance?.hasActiveAgents()) {
    throw new Error('Cannot reset registry while agents are active');
  }
  registryInstance = null;
}
