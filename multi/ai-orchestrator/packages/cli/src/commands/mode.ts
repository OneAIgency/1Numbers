/**
 * Mode Commands
 *
 * CLI commands for mode management.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../client/api.js';
import { formatModeConfig, formatModeList, formatJson } from '../ui/format.js';

export const modeCommand = new Command('mode')
  .description('Manage execution modes');

// List modes
modeCommand
  .command('list')
  .description('List all available modes')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching modes...').start();

    try {
      const modes = await api.listModes();
      spinner.stop();

      if (options.json) {
        console.log(formatJson(modes));
      } else {
        console.log(formatModeList(modes));
      }
    } catch (error) {
      spinner.fail('Failed to list modes');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Get current mode
modeCommand
  .command('current')
  .description('Get current active mode')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching current mode...').start();

    try {
      const current = await api.getCurrentMode();
      spinner.stop();

      if (options.json) {
        console.log(formatJson(current));
      } else {
        console.log(chalk.bold('\nCurrent Mode: ') + chalk.cyan(current.mode));
        console.log(chalk.gray(`Active tasks: ${current.active_tasks}`));
        console.log(formatModeConfig(current.config));
      }
    } catch (error) {
      spinner.fail('Failed to get current mode');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Switch mode
modeCommand
  .command('switch <mode>')
  .description('Switch to a different mode')
  .action(async (mode) => {
    const validModes = ['SPEED', 'QUALITY', 'AUTONOMY', 'COST'];
    const normalizedMode = mode.toUpperCase();

    if (!validModes.includes(normalizedMode)) {
      console.error(chalk.red(`Invalid mode: ${mode}`));
      console.error(chalk.gray(`Valid modes: ${validModes.join(', ')}`));
      process.exit(1);
    }

    const spinner = ora(`Switching to ${normalizedMode} mode...`).start();

    try {
      const result = await api.switchMode(normalizedMode);
      spinner.succeed(result.message);

      // Show mode details
      const config = await api.getModeConfig(normalizedMode);
      console.log(formatModeConfig(config.config));
    } catch (error) {
      spinner.fail('Failed to switch mode');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Get mode details
modeCommand
  .command('info <mode>')
  .description('Get details about a specific mode')
  .option('--json', 'Output as JSON')
  .action(async (mode, options) => {
    const normalizedMode = mode.toUpperCase();
    const spinner = ora(`Fetching ${normalizedMode} mode info...`).start();

    try {
      const config = await api.getModeConfig(normalizedMode);
      spinner.stop();

      if (options.json) {
        console.log(formatJson(config));
      } else {
        console.log(chalk.bold(`\n${normalizedMode} Mode Configuration`));
        console.log(formatModeConfig(config.config));

        if (config.updated_at) {
          console.log(chalk.gray(`\nLast updated: ${new Date(config.updated_at).toLocaleString()}`));
          if (config.updated_by) {
            console.log(chalk.gray(`Updated by: ${config.updated_by}`));
          }
        }
      }
    } catch (error) {
      spinner.fail('Failed to get mode info');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Compare modes
modeCommand
  .command('compare')
  .description('Compare all modes side by side')
  .action(async () => {
    const spinner = ora('Fetching modes...').start();

    try {
      const modes = await api.listModes();
      spinner.stop();

      console.log(chalk.bold('\nMode Comparison\n'));

      const headers = ['Property', ...modes.map((m) => m.mode)];
      const properties = [
        'decompositionDepth',
        'parallelizationLevel',
        'validationDepth',
        'requiresHumanApproval',
        'requiredAgents',
        'taskTimeout',
        'maxRetries',
      ];

      // Print header
      console.log(chalk.cyan(headers.map((h) => h.padEnd(20)).join('')));
      console.log(chalk.gray('-'.repeat(headers.length * 20)));

      // Print rows
      for (const prop of properties) {
        const row = [
          prop.padEnd(20),
          ...modes.map((m) => {
            const value = m.config[prop];
            if (Array.isArray(value)) {
              return String(value.length).padEnd(20);
            }
            if (typeof value === 'boolean') {
              return (value ? 'Yes' : 'No').padEnd(20);
            }
            return String(value || '-').padEnd(20);
          }),
        ];
        console.log(row.join(''));
      }
    } catch (error) {
      spinner.fail('Failed to compare modes');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });
