/**
 * Task Type Definitions
 *
 * Core task, phase, and execution types for the orchestration system.
 */

import { z } from 'zod';
import type { ExecutionMode } from './mode.js';
import type { AgentType, AgentResult } from './agent.js';

export type TaskStatus =
  | 'pending'
  | 'analyzing'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type PhaseStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface Task {
  id: string;
  projectId: string;
  description: string;
  status: TaskStatus;
  mode: ExecutionMode;
  priority: number;

  // Decomposition
  phases: Phase[];
  currentPhase: number;

  // Results
  results: Record<string, PhaseResult>;
  filesModified: string[];

  // Metadata
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;

  // Cost tracking
  tokensUsed: number;
  estimatedCost: number;

  // Error info
  errors: string[];
}

export interface Phase {
  number: number;
  name: string;
  description?: string;
  status: PhaseStatus;
  parallel: boolean;
  required: boolean;
  tasks: PhaseTask[];

  // Timing
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
}

export interface PhaseTask {
  id: string;
  description: string;
  agent: AgentType;
  status: PhaseStatus;

  // Input/Output
  input?: Record<string, unknown>;
  output?: AgentResult;

  // Dependencies
  dependencies?: string[]; // Task IDs this depends on

  // Metadata
  file?: string;
  model?: string;
}

export interface PhaseResult {
  phaseNumber: number;
  status: PhaseStatus;
  results: AgentResult[];
  filesModified: string[];
  errors: string[];
  duration: number;
}

export interface TaskCreateInput {
  description: string;
  projectId: string;
  mode?: ExecutionMode;
  priority?: number;
  agentPreferences?: Record<AgentType, { model?: string; temperature?: number }>;
  maxWorkers?: number;
}

export interface TaskFilter {
  projectId?: string;
  status?: TaskStatus | TaskStatus[];
  mode?: ExecutionMode;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  avgDuration: number;
  totalCost: number;
}

// Execution state for LangGraph
export interface OrchestratorState {
  taskId: string;
  description: string;
  projectId: string;
  mode: ExecutionMode;

  // Phases
  phases: Phase[];
  currentPhase: number;

  // Results
  results: Record<string, PhaseResult>;
  filesModified: string[];

  // Status
  status: TaskStatus;
  errors: string[];

  // Cost
  tokensUsed: number;
  estimatedCost: number;
}

// Zod schemas for validation
export const TaskCreateInputSchema = z.object({
  description: z.string().min(1).max(10000),
  projectId: z.string().uuid(),
  mode: z.enum(['SPEED', 'QUALITY', 'AUTONOMY', 'COST']).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  agentPreferences: z.record(z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional()
  })).optional(),
  maxWorkers: z.number().int().min(1).max(16).optional()
});

export const TaskFilterSchema = z.object({
  projectId: z.string().uuid().optional(),
  status: z.union([
    z.enum(['pending', 'analyzing', 'running', 'paused', 'completed', 'failed', 'cancelled']),
    z.array(z.enum(['pending', 'analyzing', 'running', 'paused', 'completed', 'failed', 'cancelled']))
  ]).optional(),
  mode: z.enum(['SPEED', 'QUALITY', 'AUTONOMY', 'COST']).optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional()
});
