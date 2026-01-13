/**
 * @orchestrator/core - Types
 *
 * Central export for all type definitions.
 */

// Mode types
export {
  ExecutionMode,
  type DecompositionDepth,
  type ParallelizationLevel,
  type ValidationDepth,
  type ModelConfig,
  type ModeConfig,
  type ValidationConfig,
  ModeConfigSchema,
  DEFAULT_MODE_CONFIGS
} from './mode.js';

// Agent types
export {
  AgentType,
  type AgentStatus,
  type AgentCapability,
  type AgentTask,
  type AgentResult,
  type AgentProgress,
  AGENT_CAPABILITIES,
  AGENT_DEPENDENCIES,
  AgentTaskSchema,
  AgentResultSchema
} from './agent.js';

// Task types
export {
  type TaskStatus,
  type PhaseStatus,
  type Task,
  type Phase,
  type PhaseTask,
  type PhaseResult,
  type TaskCreateInput,
  type TaskFilter,
  type TaskStats,
  type OrchestratorState,
  TaskCreateInputSchema,
  TaskFilterSchema
} from './task.js';

// Event types
export {
  type AggregateType,
  type DomainEvent,
  type EventMetadata,
  type EventType,
  type TaskCreatedEventData,
  type TaskStartedEventData,
  type TaskCompletedEventData,
  type TaskFailedEventData,
  type PhaseStartedEventData,
  type PhaseCompletedEventData,
  type AgentStartedEventData,
  type AgentProgressEventData,
  type AgentCompletedEventData,
  type ModeSwitchedEventData,
  type CostIncurredEventData,
  type WSMessage,
  type WSMessageType,
  DomainEventSchema,
  WSMessageSchema
} from './event.js';

// Project types
export {
  type Project,
  type ProjectSettings,
  type AgentSettings,
  type ProjectCreateInput,
  type ProjectUpdateInput,
  DEFAULT_PROJECT_SETTINGS,
  ProjectSettingsSchema,
  ProjectCreateInputSchema,
  ProjectUpdateInputSchema
} from './project.js';
