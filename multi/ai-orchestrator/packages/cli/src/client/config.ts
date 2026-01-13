/**
 * CLI Configuration
 *
 * Manages CLI configuration from file and environment.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface CLIConfig {
  apiUrl: string;
  apiKey?: string;
  defaultMode: string;
  outputFormat: 'text' | 'json';
  projectPath?: string;
}

const CONFIG_DIR = join(homedir(), '.orchestrator');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: CLIConfig = {
  apiUrl: 'http://localhost:8000',
  defaultMode: 'QUALITY',
  outputFormat: 'text',
};

export function getConfig(): CLIConfig {
  // Environment variables take precedence
  const envConfig: Partial<CLIConfig> = {};

  const apiUrl = process.env['ORCHESTRATOR_API_URL'];
  const apiKey = process.env['ORCHESTRATOR_API_KEY'];
  const defaultMode = process.env['ORCHESTRATOR_MODE'];
  const projectPath = process.env['ORCHESTRATOR_PROJECT_PATH'];

  if (apiUrl !== undefined) envConfig.apiUrl = apiUrl;
  if (apiKey !== undefined) envConfig.apiKey = apiKey;
  if (defaultMode !== undefined) envConfig.defaultMode = defaultMode;
  if (projectPath !== undefined) envConfig.projectPath = projectPath;

  // Load from file
  let fileConfig: Partial<CLIConfig> = {};
  if (existsSync(CONFIG_FILE)) {
    try {
      fileConfig = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8')) as Partial<CLIConfig>;
    } catch {
      // Ignore parse errors
    }
  }

  // Merge configs: env > file > default
  const result: CLIConfig = {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    ...envConfig,
  };

  return result;
}

export function saveConfig(config: Partial<CLIConfig>): void {
  // Ensure config directory exists
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Load existing config
  const existing = getConfig();

  // Merge and save
  const newConfig = { ...existing, ...config };
  writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
