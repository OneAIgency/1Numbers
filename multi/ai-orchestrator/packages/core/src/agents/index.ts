/**
 * @orchestrator/core - Agents
 *
 * Central export for agent system.
 */

export { Agent, type AgentConfig, type AgentContext, isSuccessfulResult, hasFilesModified } from './base/Agent.js';
export { AgentRegistry, getAgentRegistry, resetAgentRegistry, type AgentRegistryConfig } from './base/AgentRegistry.js';
