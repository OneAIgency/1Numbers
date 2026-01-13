/**
 * Agent Type Definitions
 *
 * Comprehensive catalog of agents for the full development lifecycle:
 * - Lifecycle agents (concept → deploy)
 * - Specialized agents (security, debug, migrate)
 * - Framework experts (React, Node, Python, Swift)
 */

import { z } from 'zod';

// All available agent types
export enum AgentType {
  // Lifecycle Agents
  CONCEPT = 'concept',
  ARCHITECT = 'architect',
  IMPLEMENT = 'implement',
  TEST = 'test',
  REVIEW = 'review',
  OPTIMIZE = 'optimize',
  DOCS = 'docs',
  DEPLOY = 'deploy',

  // Specialized Agents
  SECURITY = 'security',
  REFACTOR = 'refactor',
  DEBUG = 'debug',
  MIGRATE = 'migrate',

  // Framework-Specific Agents
  REACT_EXPERT = 'react-expert',
  NODE_EXPERT = 'node-expert',
  PYTHON_EXPERT = 'python-expert',
  SWIFT_EXPERT = 'swift-expert',
  RUST_EXPERT = 'rust-expert'
}

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AgentCapability {
  agent: AgentType;
  name: string;
  description: string;
  capabilities: string[];
  inputTypes: string[];
  outputTypes: string[];
  requiredContext: string[];
  estimatedDuration: number; // ms
}

export interface AgentTask {
  id: string;
  description: string;
  agent: AgentType;
  projectPath: string;
  context: Record<string, unknown>;
  filesModified?: string[];
  architectureDesign?: Record<string, unknown>;
  previousResults?: Map<AgentType, AgentResult>;
}

export interface AgentResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  filesModified?: string[];
  suggestions?: string[];
  duration?: number;
  tokensUsed?: {
    input: number;
    output: number;
  };
  cost?: number;
}

export interface AgentProgress {
  agent: AgentType;
  taskId: string;
  progress: number; // 0-100
  message: string;
  timestamp: Date;
}

// Agent capability definitions
export const AGENT_CAPABILITIES: Record<AgentType, AgentCapability> = {
  [AgentType.CONCEPT]: {
    agent: AgentType.CONCEPT,
    name: 'Concept Agent',
    description: 'Analyzes requirements and generates user stories',
    capabilities: ['requirement-analysis', 'user-story-generation', 'success-criteria', 'risk-assessment'],
    inputTypes: ['task-description'],
    outputTypes: ['problem-statement', 'user-stories', 'success-criteria', 'risks'],
    requiredContext: ['project-description'],
    estimatedDuration: 30000
  },

  [AgentType.ARCHITECT]: {
    agent: AgentType.ARCHITECT,
    name: 'Architect Agent',
    description: 'Designs technical architecture and component diagrams',
    capabilities: ['architecture-design', 'component-design', 'api-design', 'data-modeling'],
    inputTypes: ['concept-output', 'project-context'],
    outputTypes: ['component-diagram', 'data-flow', 'api-contracts', 'file-structure'],
    requiredContext: ['project-structure', 'existing-patterns'],
    estimatedDuration: 60000
  },

  [AgentType.IMPLEMENT]: {
    agent: AgentType.IMPLEMENT,
    name: 'Implementation Agent',
    description: 'Generates and writes production-ready code',
    capabilities: ['code-generation', 'file-writing', 'pattern-following', 'type-safety'],
    inputTypes: ['architecture-design', 'task-description'],
    outputTypes: ['source-code', 'modified-files'],
    requiredContext: ['project-patterns', 'similar-files', 'app-truth'],
    estimatedDuration: 120000
  },

  [AgentType.TEST]: {
    agent: AgentType.TEST,
    name: 'Test Agent',
    description: 'Creates and runs comprehensive tests',
    capabilities: ['test-generation', 'test-execution', 'coverage-analysis', 'edge-case-detection'],
    inputTypes: ['source-code', 'modified-files'],
    outputTypes: ['test-files', 'test-results', 'coverage-report'],
    requiredContext: ['test-patterns', 'existing-tests'],
    estimatedDuration: 180000
  },

  [AgentType.REVIEW]: {
    agent: AgentType.REVIEW,
    name: 'Review Agent',
    description: 'Performs code review and suggests improvements',
    capabilities: ['code-review', 'best-practices', 'bug-detection', 'maintainability-analysis'],
    inputTypes: ['source-code', 'modified-files'],
    outputTypes: ['review-comments', 'suggestions', 'rating'],
    requiredContext: ['coding-standards'],
    estimatedDuration: 90000
  },

  [AgentType.OPTIMIZE]: {
    agent: AgentType.OPTIMIZE,
    name: 'Optimization Agent',
    description: 'Optimizes code for performance',
    capabilities: ['performance-analysis', 'bottleneck-detection', 'optimization-suggestions'],
    inputTypes: ['source-code'],
    outputTypes: ['optimized-code', 'performance-report'],
    requiredContext: ['performance-requirements'],
    estimatedDuration: 120000
  },

  [AgentType.DOCS]: {
    agent: AgentType.DOCS,
    name: 'Documentation Agent',
    description: 'Generates comprehensive documentation',
    capabilities: ['api-docs', 'readme-generation', 'jsdoc', 'usage-examples'],
    inputTypes: ['source-code', 'api-contracts'],
    outputTypes: ['documentation', 'examples'],
    requiredContext: ['doc-standards'],
    estimatedDuration: 60000
  },

  [AgentType.DEPLOY]: {
    agent: AgentType.DEPLOY,
    name: 'Deployment Agent',
    description: 'Handles deployment automation',
    capabilities: ['build-verification', 'deployment', 'rollback', 'health-check'],
    inputTypes: ['build-artifacts'],
    outputTypes: ['deployment-status', 'deployment-url'],
    requiredContext: ['deployment-config'],
    estimatedDuration: 300000
  },

  [AgentType.SECURITY]: {
    agent: AgentType.SECURITY,
    name: 'Security Agent',
    description: 'Performs security audits and vulnerability detection',
    capabilities: ['vulnerability-scan', 'security-review', 'dependency-audit'],
    inputTypes: ['source-code', 'dependencies'],
    outputTypes: ['security-report', 'vulnerabilities'],
    requiredContext: ['security-requirements'],
    estimatedDuration: 120000
  },

  [AgentType.REFACTOR]: {
    agent: AgentType.REFACTOR,
    name: 'Refactor Agent',
    description: 'Refactors code for better structure',
    capabilities: ['code-restructuring', 'pattern-application', 'cleanup'],
    inputTypes: ['source-code'],
    outputTypes: ['refactored-code'],
    requiredContext: ['target-patterns'],
    estimatedDuration: 150000
  },

  [AgentType.DEBUG]: {
    agent: AgentType.DEBUG,
    name: 'Debug Agent',
    description: 'Assists with debugging and error resolution',
    capabilities: ['error-analysis', 'root-cause-detection', 'fix-suggestion'],
    inputTypes: ['error-logs', 'source-code'],
    outputTypes: ['diagnosis', 'fix-suggestions'],
    requiredContext: ['error-context'],
    estimatedDuration: 90000
  },

  [AgentType.MIGRATE]: {
    agent: AgentType.MIGRATE,
    name: 'Migration Agent',
    description: 'Handles code and data migrations',
    capabilities: ['version-migration', 'api-migration', 'data-migration'],
    inputTypes: ['source-code', 'migration-spec'],
    outputTypes: ['migrated-code', 'migration-report'],
    requiredContext: ['migration-requirements'],
    estimatedDuration: 180000
  },

  // Framework experts
  [AgentType.REACT_EXPERT]: {
    agent: AgentType.REACT_EXPERT,
    name: 'React Expert',
    description: 'Specialized in React patterns and best practices',
    capabilities: ['react-patterns', 'hooks', 'state-management', 'component-design'],
    inputTypes: ['react-code'],
    outputTypes: ['react-code'],
    requiredContext: ['react-version', 'ui-library'],
    estimatedDuration: 90000
  },

  [AgentType.NODE_EXPERT]: {
    agent: AgentType.NODE_EXPERT,
    name: 'Node.js Expert',
    description: 'Specialized in Node.js and backend patterns',
    capabilities: ['node-patterns', 'api-design', 'performance', 'security'],
    inputTypes: ['node-code'],
    outputTypes: ['node-code'],
    requiredContext: ['node-version', 'framework'],
    estimatedDuration: 90000
  },

  [AgentType.PYTHON_EXPERT]: {
    agent: AgentType.PYTHON_EXPERT,
    name: 'Python Expert',
    description: 'Specialized in Python patterns and frameworks',
    capabilities: ['python-patterns', 'fastapi', 'django', 'data-science'],
    inputTypes: ['python-code'],
    outputTypes: ['python-code'],
    requiredContext: ['python-version', 'framework'],
    estimatedDuration: 90000
  },

  [AgentType.SWIFT_EXPERT]: {
    agent: AgentType.SWIFT_EXPERT,
    name: 'Swift Expert',
    description: 'Specialized in Swift and Apple platforms',
    capabilities: ['swiftui', 'uikit', 'combine', 'core-data'],
    inputTypes: ['swift-code'],
    outputTypes: ['swift-code'],
    requiredContext: ['swift-version', 'platform'],
    estimatedDuration: 90000
  },

  [AgentType.RUST_EXPERT]: {
    agent: AgentType.RUST_EXPERT,
    name: 'Rust Expert',
    description: 'Specialized in Rust patterns and systems programming',
    capabilities: ['rust-patterns', 'memory-safety', 'concurrency', 'wasm'],
    inputTypes: ['rust-code'],
    outputTypes: ['rust-code'],
    requiredContext: ['rust-version'],
    estimatedDuration: 90000
  }
};

// Agent dependencies - which agents depend on outputs from other agents
export const AGENT_DEPENDENCIES: Partial<Record<AgentType, AgentType[]>> = {
  [AgentType.ARCHITECT]: [AgentType.CONCEPT],
  [AgentType.IMPLEMENT]: [AgentType.ARCHITECT],
  [AgentType.TEST]: [AgentType.IMPLEMENT],
  [AgentType.REVIEW]: [AgentType.IMPLEMENT],
  [AgentType.SECURITY]: [AgentType.IMPLEMENT],
  [AgentType.OPTIMIZE]: [AgentType.IMPLEMENT, AgentType.TEST],
  [AgentType.DOCS]: [AgentType.IMPLEMENT],
  [AgentType.DEPLOY]: [AgentType.TEST, AgentType.REVIEW]
};

// Zod schemas
export const AgentTaskSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  agent: z.nativeEnum(AgentType),
  projectPath: z.string(),
  context: z.record(z.unknown()),
  filesModified: z.array(z.string()).optional(),
  architectureDesign: z.record(z.unknown()).optional()
});

export const AgentResultSchema = z.object({
  success: z.boolean(),
  output: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  filesModified: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional(),
  duration: z.number().optional(),
  tokensUsed: z.object({
    input: z.number(),
    output: z.number()
  }).optional(),
  cost: z.number().optional()
});
