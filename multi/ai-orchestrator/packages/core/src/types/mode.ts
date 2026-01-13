/**
 * Execution Mode Types
 *
 * Four configurable modes switchable from admin panel:
 * - SPEED: Fast code generation, minimal validation
 * - QUALITY: Comprehensive validation, all agents
 * - AUTONOMY: Full lifecycle from idea to deployment
 * - COST: Minimize API costs, prefer local models
 */

import { z } from 'zod';

export enum ExecutionMode {
  SPEED = 'SPEED',
  QUALITY = 'QUALITY',
  AUTONOMY = 'AUTONOMY',
  COST = 'COST'
}

export type DecompositionDepth = 'shallow' | 'standard' | 'deep';
export type ParallelizationLevel = 'aggressive' | 'balanced' | 'conservative';
export type ValidationDepth = 'minimal' | 'standard' | 'comprehensive';

export interface ModelConfig {
  provider: 'claude' | 'ollama';
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface ModeConfig {
  mode: ExecutionMode;

  // Task decomposition
  decompositionDepth: DecompositionDepth;
  parallelizationLevel: ParallelizationLevel;

  // Validation
  validationDepth: ValidationDepth;
  requiresHumanApproval: boolean;

  // AI Model selection
  primaryModel: ModelConfig;
  fallbackModel: ModelConfig;
  useLocalModels: boolean;

  // Agent selection (using string values from AgentType enum)
  requiredAgents: string[];
  optionalAgents: string[];

  // Timeouts and limits
  taskTimeout: number;  // ms
  maxRetries: number;
  costLimit?: number;   // USD
}

export interface ValidationConfig {
  runTypeCheck: boolean;
  runLint: boolean;
  runBuild: boolean;
  runTests: boolean;
  requireCodeReview: boolean;
  requireSecurityScan?: boolean;
  minTestCoverage?: number;
}

// Zod schema for validation
export const ModeConfigSchema = z.object({
  mode: z.nativeEnum(ExecutionMode),
  decompositionDepth: z.enum(['shallow', 'standard', 'deep']),
  parallelizationLevel: z.enum(['aggressive', 'balanced', 'conservative']),
  validationDepth: z.enum(['minimal', 'standard', 'comprehensive']),
  requiresHumanApproval: z.boolean(),
  primaryModel: z.object({
    provider: z.enum(['claude', 'ollama']),
    model: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().positive()
  }),
  fallbackModel: z.object({
    provider: z.enum(['claude', 'ollama']),
    model: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().positive()
  }),
  useLocalModels: z.boolean(),
  requiredAgents: z.array(z.string()),
  optionalAgents: z.array(z.string()),
  taskTimeout: z.number().positive(),
  maxRetries: z.number().int().min(0),
  costLimit: z.number().positive().optional()
});

// Default configurations for each mode
export const DEFAULT_MODE_CONFIGS: Record<ExecutionMode, ModeConfig> = {
  [ExecutionMode.SPEED]: {
    mode: ExecutionMode.SPEED,
    decompositionDepth: 'shallow',
    parallelizationLevel: 'aggressive',
    validationDepth: 'minimal',
    requiresHumanApproval: false,
    primaryModel: {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.8,
      maxTokens: 4096
    },
    fallbackModel: {
      provider: 'ollama',
      model: 'codellama:7b',
      temperature: 0.7,
      maxTokens: 2048
    },
    useLocalModels: false,
    requiredAgents: ['implement'],
    optionalAgents: [],
    taskTimeout: 60000,
    maxRetries: 1
  },

  [ExecutionMode.QUALITY]: {
    mode: ExecutionMode.QUALITY,
    decompositionDepth: 'deep',
    parallelizationLevel: 'conservative',
    validationDepth: 'comprehensive',
    requiresHumanApproval: true,
    primaryModel: {
      provider: 'claude',
      model: 'claude-opus-4-5-20251101',
      temperature: 0.3,
      maxTokens: 8192
    },
    fallbackModel: {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.5,
      maxTokens: 4096
    },
    useLocalModels: false,
    requiredAgents: ['concept', 'architect', 'implement', 'test', 'review', 'security', 'docs'],
    optionalAgents: ['optimize'],
    taskTimeout: 600000,
    maxRetries: 3
  },

  [ExecutionMode.AUTONOMY]: {
    mode: ExecutionMode.AUTONOMY,
    decompositionDepth: 'deep',
    parallelizationLevel: 'balanced',
    validationDepth: 'standard',
    requiresHumanApproval: false,
    primaryModel: {
      provider: 'claude',
      model: 'claude-opus-4-5-20251101',
      temperature: 0.5,
      maxTokens: 8192
    },
    fallbackModel: {
      provider: 'ollama',
      model: 'codellama:34b',
      temperature: 0.5,
      maxTokens: 4096
    },
    useLocalModels: true,
    requiredAgents: ['concept', 'architect', 'implement', 'test', 'review', 'deploy'],
    optionalAgents: ['security', 'optimize', 'docs'],
    taskTimeout: 1800000,
    maxRetries: 5
  },

  [ExecutionMode.COST]: {
    mode: ExecutionMode.COST,
    decompositionDepth: 'shallow',
    parallelizationLevel: 'conservative',
    validationDepth: 'minimal',
    requiresHumanApproval: false,
    primaryModel: {
      provider: 'ollama',
      model: 'codellama:7b',
      temperature: 0.7,
      maxTokens: 2048
    },
    fallbackModel: {
      provider: 'claude',
      model: 'claude-3-5-haiku-20241022',
      temperature: 0.5,
      maxTokens: 2048
    },
    useLocalModels: true,
    requiredAgents: ['implement'],
    optionalAgents: ['test'],
    taskTimeout: 300000,
    maxRetries: 2,
    costLimit: 1.00
  }
};
