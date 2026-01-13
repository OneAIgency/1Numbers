/**
 * API Service
 *
 * HTTP client for the orchestrator API.
 */

const API_BASE = '/api/v2';

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.detail || error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Task types
export interface Task {
  id: string;
  project_id: string | null;
  description: string;
  status: string;
  mode: string;
  priority: number;
  phases: Phase[];
  current_phase: number;
  results: Record<string, unknown>;
  files_modified: string[];
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  tokens_used: number;
  estimated_cost: number;
  errors: Array<{ type: string; message: string }>;
  executions?: Execution[];
}

export interface Phase {
  number: number;
  name: string;
  description: string;
  status: string;
  parallel: boolean;
  agents: string[];
}

export interface Execution {
  id: string;
  task_id: string;
  phase_number: number;
  agent_type: string;
  status: string;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error: string | null;
  model_used: string | null;
  tokens_input: number;
  tokens_output: number;
  cost: number;
  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  description: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ModeConfig {
  mode: string;
  config: Record<string, unknown>;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface SystemStats {
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  running_tasks: number;
  total_executions: number;
  avg_task_duration_ms: number | null;
  success_rate: number;
}

export interface CostStats {
  total_cost: number;
  cost_by_provider: Record<string, number>;
  cost_by_model: Record<string, number>;
  total_tokens_input: number;
  total_tokens_output: number;
  period_start: string;
  period_end: string;
}

export interface HealthStatus {
  status: string;
  version: string;
  database: { status: string };
  cache: { status: string };
  claude: { status: string };
  ollama: { status: string };
}

export interface Agent {
  type: string;
  name: string;
  description: string;
  capabilities: string[];
  dependencies: string[];
  supported_modes: string[];
}

// API methods
export const api = {
  // Tasks
  createTask: (data: {
    description: string;
    project_id?: string;
    mode?: string;
    priority?: number;
  }) => request<Task>('POST', '/tasks', data),

  listTasks: (params?: {
    status?: string;
    project_id?: string;
    mode?: string;
    page?: number;
    page_size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.project_id) query.set('project_id', params.project_id);
    if (params?.mode) query.set('mode', params.mode);
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    const queryStr = query.toString();
    return request<{ tasks: Task[]; total: number; page: number; page_size: number }>(
      'GET',
      `/tasks${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getTask: (taskId: string) => request<Task>('GET', `/tasks/${taskId}`),

  cancelTask: (taskId: string) =>
    request<{ message: string }>('DELETE', `/tasks/${taskId}`),

  retryTask: (taskId: string) =>
    request<Task>('POST', `/tasks/${taskId}/retry`),

  // Projects
  createProject: (data: { name: string; path: string; description?: string }) =>
    request<Project>('POST', '/projects', data),

  listProjects: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ projects: Project[]; total: number }>('GET', `/projects${query}`);
  },

  getProject: (projectId: string) =>
    request<Project>('GET', `/projects/${projectId}`),

  deleteProject: (projectId: string) =>
    request<{ message: string }>('DELETE', `/projects/${projectId}`),

  // Modes
  listModes: () => request<ModeConfig[]>('GET', '/modes'),

  getCurrentMode: () =>
    request<{ mode: string; config: Record<string, unknown>; active_tasks: number }>(
      'GET',
      '/modes/current'
    ),

  switchMode: (mode: string) =>
    request<{ message: string; data: { mode: string } }>('POST', '/modes/switch', { mode }),

  getModeConfig: (mode: string) => request<ModeConfig>('GET', `/modes/${mode}`),

  updateModeConfig: (mode: string, config: Record<string, unknown>, isActive: boolean) =>
    request<ModeConfig>('PUT', `/modes/${mode}`, { config, is_active: isActive }),

  // Agents
  listAgents: () => request<{ agents: Agent[] }>('GET', '/agents'),

  // Monitoring
  getStats: () => request<SystemStats>('GET', '/monitoring/stats'),

  getCosts: (days?: number) => {
    const query = days ? `?days=${days}` : '';
    return request<CostStats>('GET', `/monitoring/costs${query}`);
  },

  // Health
  healthCheck: () => request<HealthStatus>('GET', '/health'),
};
