/**
 * Project Type Definitions
 *
 * Project configuration and settings types.
 */

import { z } from 'zod';

export interface Project {
  id: string;
  name: string;
  path: string;
  description?: string;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  maxWorkers: number;
  preferredModel: string;
  fallbackModel: string;
  cacheEnabled: boolean;
  cacheTtl: number;
  agents: Record<string, AgentSettings>;
  buildCommand?: string;
  testCommand?: string;
  lintCommand?: string;
}

export interface AgentSettings {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  enabled?: boolean;
}

export interface ProjectCreateInput {
  name: string;
  path: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
}

// Default project settings
export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  maxWorkers: 4,
  preferredModel: 'claude-opus-4-5-20251101',
  fallbackModel: 'ollama:codellama:7b',
  cacheEnabled: true,
  cacheTtl: 3600,
  agents: {
    implement: { model: 'claude-3-5-sonnet-20241022', temperature: 0.7 },
    review: { model: 'claude-3-5-haiku-20241022', temperature: 0.3 },
    test: { model: 'ollama:codellama:7b', temperature: 0.5 }
  }
};

// Zod schemas
export const ProjectSettingsSchema = z.object({
  maxWorkers: z.number().int().min(1).max(16),
  preferredModel: z.string(),
  fallbackModel: z.string(),
  cacheEnabled: z.boolean(),
  cacheTtl: z.number().int().min(60).max(86400),
  agents: z.record(z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().positive().optional(),
    enabled: z.boolean().optional()
  })).optional(),
  buildCommand: z.string().optional(),
  testCommand: z.string().optional(),
  lintCommand: z.string().optional()
});

export const ProjectCreateInputSchema = z.object({
  name: z.string().min(1).max(255),
  path: z.string().min(1),
  description: z.string().max(1000).optional(),
  settings: ProjectSettingsSchema.partial().optional()
});

export const ProjectUpdateInputSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  settings: ProjectSettingsSchema.partial().optional()
});
