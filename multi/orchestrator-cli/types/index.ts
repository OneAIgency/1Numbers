/**
 * Type definitions for the orchestrator system
 */

export interface OrchestratorConfig {
  maxParallelWorkers: number;
  verbose?: boolean;
}

export interface Task {
  id: string;
  agent: AgentType;
  description: string;
  file?: string;
  dependencies?: string[];
  constraints?: string[];
  successCriteria?: string[];
}

export type AgentType = 
  | 'implement'
  | 'verify'
  | 'test'
  | 'docs'
  | 'numerology-expert'
  | 'creative'
  | 'optimize';

export interface TaskPhase {
  number: number;
  name: string;
  parallel: boolean;
  tasks: Task[];
  required?: boolean;
}

export interface ExecutionPlan {
  taskDescription: string;
  phases: TaskPhase[];
  totalTasks: number;
  estimatedTime: number; // minutes
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  output?: string;
  error?: string;
  duration: number; // milliseconds
  filesModified?: string[];
}

export interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings?: string[];
}

