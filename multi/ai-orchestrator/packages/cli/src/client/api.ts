/**
 * API Client
 *
 * HTTP client for communicating with the orchestrator API.
 */

import { getConfig } from './config.js';

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
}

export interface Phase {
  number: number;
  name: string;
  description: string;
  status: string;
  parallel: boolean;
  agents: string[];
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

class APIClient {
  private baseUrl: string;

  constructor() {
    const config = getConfig();
    this.baseUrl = config.apiUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const config = getConfig();

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
    };

    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({ error: 'Unknown error' })) as Record<string, unknown>;
      const detail = typeof errorResponse['detail'] === 'string' ? errorResponse['detail'] : undefined;
      const errorMsg = typeof errorResponse['error'] === 'string' ? errorResponse['error'] : undefined;
      throw new Error(detail || errorMsg || `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Tasks
  async createTask(data: {
    description: string;
    project_id?: string;
    mode?: string;
    priority?: number;
  }): Promise<Task> {
    return this.request<Task>('POST', '/api/v2/tasks', data);
  }

  async listTasks(params?: {
    status?: string;
    project_id?: string;
    mode?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; page_size: number }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.project_id) query.set('project_id', params.project_id);
    if (params?.mode) query.set('mode', params.mode);
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));

    const queryStr = query.toString();
    return this.request('GET', `/api/v2/tasks${queryStr ? `?${queryStr}` : ''}`);
  }

  async getTask(taskId: string): Promise<Task> {
    return this.request('GET', `/api/v2/tasks/${taskId}`);
  }

  async cancelTask(taskId: string): Promise<{ message: string }> {
    return this.request('DELETE', `/api/v2/tasks/${taskId}`);
  }

  async retryTask(taskId: string): Promise<Task> {
    return this.request('POST', `/api/v2/tasks/${taskId}/retry`);
  }

  // Projects
  async createProject(data: {
    name: string;
    path: string;
    description?: string;
  }): Promise<Project> {
    return this.request<Project>('POST', '/api/v2/projects', data);
  }

  async listProjects(search?: string): Promise<{ projects: Project[]; total: number }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request('GET', `/api/v2/projects${query}`);
  }

  async getProject(projectId: string): Promise<Project> {
    return this.request('GET', `/api/v2/projects/${projectId}`);
  }

  async deleteProject(projectId: string): Promise<{ message: string }> {
    return this.request('DELETE', `/api/v2/projects/${projectId}`);
  }

  // Modes
  async listModes(): Promise<ModeConfig[]> {
    return this.request('GET', '/api/v2/modes');
  }

  async getCurrentMode(): Promise<{
    mode: string;
    config: Record<string, unknown>;
    active_tasks: number;
  }> {
    return this.request('GET', '/api/v2/modes/current');
  }

  async switchMode(mode: string): Promise<{ message: string; data: { mode: string } }> {
    return this.request('POST', '/api/v2/modes/switch', { mode });
  }

  async getModeConfig(mode: string): Promise<ModeConfig> {
    return this.request('GET', `/api/v2/modes/${mode}`);
  }

  // Monitoring
  async getStats(): Promise<SystemStats> {
    return this.request('GET', '/api/v2/monitoring/stats');
  }

  async getCosts(days?: number): Promise<CostStats> {
    const query = days ? `?days=${days}` : '';
    return this.request('GET', `/api/v2/monitoring/costs${query}`);
  }

  // Health
  async healthCheck(): Promise<{
    status: string;
    version: string;
    database: { status: string };
    cache: { status: string };
    claude: { status: string };
    ollama: { status: string };
  }> {
    return this.request('GET', '/api/v2/health');
  }
}

export const api = new APIClient();
