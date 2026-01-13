/**
 * Event Type Definitions
 *
 * Event sourcing types for audit trail and real-time updates.
 */

import { z } from 'zod';
import type { TaskStatus, PhaseStatus } from './task.js';
import type { AgentType } from './agent.js';
import type { ExecutionMode } from './mode.js';

export type AggregateType = 'task' | 'project' | 'execution' | 'mode';

export interface DomainEvent {
  id: string;
  aggregateId: string;
  aggregateType: AggregateType;
  eventType: EventType;
  eventData: Record<string, unknown>;
  metadata: EventMetadata;
  version: number;
  timestamp: Date;
}

export interface EventMetadata {
  userId?: string;
  correlationId?: string;
  causationId?: string;
  source?: string;
}

// All event types
export type EventType =
  // Task events
  | 'task.created'
  | 'task.started'
  | 'task.paused'
  | 'task.resumed'
  | 'task.completed'
  | 'task.failed'
  | 'task.cancelled'

  // Phase events
  | 'task.phase.started'
  | 'task.phase.completed'
  | 'task.phase.failed'
  | 'task.phase.skipped'

  // Agent events
  | 'agent.started'
  | 'agent.progress'
  | 'agent.completed'
  | 'agent.failed'
  | 'agent.log'

  // Mode events
  | 'mode.switching'
  | 'mode.switched'
  | 'mode.config.updated'

  // Cost events
  | 'cost.incurred'
  | 'cost.limit.reached'

  // System events
  | 'system.started'
  | 'system.shutdown'
  | 'system.error';

// Event data interfaces
export interface TaskCreatedEventData {
  taskId: string;
  projectId: string;
  description: string;
  mode: ExecutionMode;
}

export interface TaskStartedEventData {
  taskId: string;
  phases: number;
}

export interface TaskCompletedEventData {
  taskId: string;
  status: TaskStatus;
  filesModified: string[];
  duration: number;
  totalCost: number;
}

export interface TaskFailedEventData {
  taskId: string;
  error: string;
  phase?: number;
  agent?: AgentType;
}

export interface PhaseStartedEventData {
  taskId: string;
  phaseNumber: number;
  phaseName: string;
  parallel: boolean;
  taskCount: number;
}

export interface PhaseCompletedEventData {
  taskId: string;
  phaseNumber: number;
  status: PhaseStatus;
  duration: number;
  filesModified: string[];
}

export interface AgentStartedEventData {
  taskId: string;
  phaseNumber: number;
  agent: AgentType;
  subtaskId: string;
}

export interface AgentProgressEventData {
  taskId: string;
  agent: AgentType;
  progress: number;
  message: string;
}

export interface AgentCompletedEventData {
  taskId: string;
  agent: AgentType;
  success: boolean;
  duration: number;
  filesModified?: string[];
  tokensUsed?: { input: number; output: number };
}

export interface ModeSwitchedEventData {
  fromMode: ExecutionMode;
  toMode: ExecutionMode;
  affectedTasks: number;
}

export interface CostIncurredEventData {
  taskId: string;
  executionId?: string;
  provider: 'claude' | 'ollama';
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costUsd: number;
}

// WebSocket message types (for real-time updates)
export interface WSMessage {
  type: WSMessageType;
  payload: Record<string, unknown>;
  timestamp: Date;
}

export type WSMessageType =
  | 'task.created'
  | 'task.progress'
  | 'task.phase.update'
  | 'task.completed'
  | 'task.failed'
  | 'agent.started'
  | 'agent.progress'
  | 'agent.log'
  | 'mode.changed'
  | 'system.stats'
  | 'cost.update';

// Zod schemas
export const DomainEventSchema = z.object({
  id: z.string().uuid(),
  aggregateId: z.string().uuid(),
  aggregateType: z.enum(['task', 'project', 'execution', 'mode']),
  eventType: z.string(),
  eventData: z.record(z.unknown()),
  metadata: z.object({
    userId: z.string().optional(),
    correlationId: z.string().optional(),
    causationId: z.string().optional(),
    source: z.string().optional()
  }),
  version: z.number().int().min(1),
  timestamp: z.date()
});

export const WSMessageSchema = z.object({
  type: z.string(),
  payload: z.record(z.unknown()),
  timestamp: z.date()
});
