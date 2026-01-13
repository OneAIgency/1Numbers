#!/usr/bin/env node
/**
 * AI Orchestrator CLI
 *
 * Command-line interface for the AI development orchestration platform.
 */

import { Command } from 'commander';
import { taskCommand } from './commands/task.js';
import { modeCommand } from './commands/mode.js';
import { statusCommand } from './commands/status.js';
import { projectCommand } from './commands/project.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('orchestrator')
  .description('AI Development Orchestration CLI')
  .version('2.0.0');

// Register commands
program.addCommand(taskCommand);
program.addCommand(modeCommand);
program.addCommand(statusCommand);
program.addCommand(projectCommand);
program.addCommand(configCommand);

// Parse arguments
program.parse();
