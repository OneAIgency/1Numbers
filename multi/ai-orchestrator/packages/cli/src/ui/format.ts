/**
 * Output Formatters
 *
 * Format data for CLI output.
 */

import chalk from 'chalk';
import type { Task, Project, ModeConfig } from '../client/api.js';

export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function formatTask(task: Task, detailed = false): string {
  const lines: string[] = [];

  // Status badge
  const statusBadge = getStatusBadge(task.status);

  lines.push('');
  lines.push(chalk.bold(`Task: ${task.id}`));
  lines.push(chalk.gray('─'.repeat(50)));
  lines.push(`  Status:      ${statusBadge}`);
  lines.push(`  Mode:        ${chalk.cyan(task.mode)}`);
  lines.push(`  Priority:    ${task.priority}`);
  lines.push(`  Description: ${task.description.slice(0, 60)}${task.description.length > 60 ? '...' : ''}`);

  if (task.project_id) {
    lines.push(`  Project:     ${task.project_id}`);
  }

  // Timestamps
  lines.push(`  Created:     ${formatDate(task.created_at)}`);
  if (task.started_at) {
    lines.push(`  Started:     ${formatDate(task.started_at)}`);
  }
  if (task.completed_at) {
    lines.push(`  Completed:   ${formatDate(task.completed_at)}`);
  }

  // Cost
  lines.push(`  Tokens:      ${task.tokens_used.toLocaleString()}`);
  lines.push(`  Cost:        $${task.estimated_cost.toFixed(4)}`);

  // Phases (if detailed)
  if (detailed && task.phases.length > 0) {
    lines.push('');
    lines.push(chalk.bold('  Phases:'));
    for (const phase of task.phases) {
      const phaseStatus = getStatusBadge(phase.status);
      const current = task.current_phase === phase.number ? chalk.yellow(' ←') : '';
      lines.push(`    ${phase.number}. ${phase.name}: ${phaseStatus}${current}`);
      lines.push(chalk.gray(`       Agents: ${phase.agents.join(', ')}`));
    }
  }

  // Errors
  if (task.errors.length > 0) {
    lines.push('');
    lines.push(chalk.red('  Errors:'));
    for (const error of task.errors) {
      lines.push(chalk.red(`    - ${error.message}`));
    }
  }

  // Files modified
  if (detailed && task.files_modified.length > 0) {
    lines.push('');
    lines.push(chalk.bold('  Files Modified:'));
    for (const file of task.files_modified.slice(0, 10)) {
      lines.push(chalk.gray(`    - ${file}`));
    }
    if (task.files_modified.length > 10) {
      lines.push(chalk.gray(`    ... and ${task.files_modified.length - 10} more`));
    }
  }

  return lines.join('\n');
}

export function formatTaskList(tasks: Task[]): string {
  if (tasks.length === 0) {
    return chalk.gray('\nNo tasks found');
  }

  const lines: string[] = [];
  lines.push('');

  // Header
  const header = [
    'ID'.padEnd(10),
    'Status'.padEnd(12),
    'Mode'.padEnd(10),
    'Description'.padEnd(40),
  ].join('');
  lines.push(chalk.bold(header));
  lines.push(chalk.gray('─'.repeat(72)));

  // Rows
  for (const task of tasks) {
    const statusBadge = getStatusBadge(task.status);
    const row = [
      task.id.slice(0, 8).padEnd(10),
      statusBadge.padEnd(22), // Extra padding for color codes
      task.mode.padEnd(10),
      task.description.slice(0, 38).padEnd(40),
    ].join('');
    lines.push(row);
  }

  return lines.join('\n');
}

export function formatProject(project: Project): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(chalk.bold(`Project: ${project.name}`));
  lines.push(chalk.gray('─'.repeat(50)));
  lines.push(`  ID:          ${project.id}`);
  lines.push(`  Path:        ${project.path}`);
  if (project.description) {
    lines.push(`  Description: ${project.description}`);
  }
  lines.push(`  Created:     ${formatDate(project.created_at)}`);
  lines.push(`  Updated:     ${formatDate(project.updated_at)}`);

  if (Object.keys(project.settings).length > 0) {
    lines.push('');
    lines.push(chalk.bold('  Settings:'));
    for (const [key, value] of Object.entries(project.settings)) {
      lines.push(`    ${key}: ${JSON.stringify(value)}`);
    }
  }

  return lines.join('\n');
}

export function formatProjectList(projects: Project[]): string {
  if (projects.length === 0) {
    return chalk.gray('\nNo projects found');
  }

  const lines: string[] = [];
  lines.push('');

  // Header
  const header = [
    'Name'.padEnd(20),
    'ID'.padEnd(10),
    'Path'.padEnd(40),
  ].join('');
  lines.push(chalk.bold(header));
  lines.push(chalk.gray('─'.repeat(70)));

  // Rows
  for (const project of projects) {
    const row = [
      project.name.slice(0, 18).padEnd(20),
      project.id.slice(0, 8).padEnd(10),
      project.path.slice(0, 38).padEnd(40),
    ].join('');
    lines.push(row);
  }

  return lines.join('\n');
}

export function formatModeConfig(config: Record<string, unknown>): string {
  const lines: string[] = [];
  lines.push('');

  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      return `${obj['provider']}/${obj['model']}`;
    }
    if (typeof value === 'boolean') {
      return value ? chalk.green('Yes') : chalk.gray('No');
    }
    return String(value);
  };

  const labels: Record<string, string> = {
    decompositionDepth: 'Decomposition',
    parallelizationLevel: 'Parallelization',
    validationDepth: 'Validation',
    requiresHumanApproval: 'Human Approval',
    primaryModel: 'Primary Model',
    fallbackModel: 'Fallback Model',
    requiredAgents: 'Required Agents',
    optionalAgents: 'Optional Agents',
    taskTimeout: 'Task Timeout',
    maxRetries: 'Max Retries',
    costLimit: 'Cost Limit',
  };

  for (const [key, value] of Object.entries(config)) {
    const label = labels[key] || key;
    lines.push(`  ${label.padEnd(18)} ${formatValue(value)}`);
  }

  return lines.join('\n');
}

export function formatModeList(modes: ModeConfig[]): string {
  const lines: string[] = [];
  lines.push(chalk.bold('\nAvailable Modes'));
  lines.push(chalk.gray('─'.repeat(50)));

  for (const mode of modes) {
    const active = mode.is_active ? chalk.green('●') : chalk.gray('○');
    const agents = (mode.config['requiredAgents'] as string[]) || [];
    lines.push(`  ${active} ${chalk.cyan(mode.mode.padEnd(12))} ${agents.join(', ')}`);
  }

  return lines.join('\n');
}

function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    pending: chalk.gray('○ pending'),
    queued: chalk.blue('◐ queued'),
    running: chalk.yellow('◑ running'),
    paused: chalk.gray('◐ paused'),
    completed: chalk.green('● completed'),
    failed: chalk.red('● failed'),
    cancelled: chalk.gray('● cancelled'),
  };

  return badges[status] || chalk.gray(`○ ${status}`);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString();
}
