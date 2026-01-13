/**
 * Config Commands
 *
 * CLI commands for configuration management.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig, saveConfig, getConfigPath, type CLIConfig } from '../client/config.js';
import { formatJson } from '../ui/format.js';

export const configCommand = new Command('config')
  .description('Manage CLI configuration');

// Show config
configCommand
  .command('show')
  .description('Show current configuration')
  .option('--json', 'Output as JSON')
  .action((options) => {
    const config = getConfig();

    if (options.json) {
      console.log(formatJson(config));
    } else {
      console.log(chalk.bold('\nCLI Configuration'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(`  API URL:      ${config.apiUrl}`);
      console.log(`  API Key:      ${config.apiKey ? '****' + config.apiKey.slice(-4) : chalk.gray('not set')}`);
      console.log(`  Default Mode: ${config.defaultMode}`);
      console.log(`  Output:       ${config.outputFormat}`);
      console.log(`  Project Path: ${config.projectPath || chalk.gray('not set')}`);
      console.log(chalk.gray(`\n  Config file: ${getConfigPath()}`));
    }
  });

// Set config value
configCommand
  .command('set <key> <value>')
  .description('Set a configuration value')
  .action((key, value) => {
    const validKeys = ['apiUrl', 'apiKey', 'defaultMode', 'outputFormat', 'projectPath'];

    if (!validKeys.includes(key)) {
      console.error(chalk.red(`Invalid key: ${key}`));
      console.error(chalk.gray(`Valid keys: ${validKeys.join(', ')}`));
      process.exit(1);
    }

    // Validate mode
    if (key === 'defaultMode') {
      const validModes = ['SPEED', 'QUALITY', 'AUTONOMY', 'COST'];
      const normalizedValue = value.toUpperCase();
      if (!validModes.includes(normalizedValue)) {
        console.error(chalk.red(`Invalid mode: ${value}`));
        console.error(chalk.gray(`Valid modes: ${validModes.join(', ')}`));
        process.exit(1);
      }
      value = normalizedValue;
    }

    // Validate output format
    if (key === 'outputFormat') {
      const validFormats = ['text', 'json'];
      if (!validFormats.includes(value)) {
        console.error(chalk.red(`Invalid format: ${value}`));
        console.error(chalk.gray(`Valid formats: ${validFormats.join(', ')}`));
        process.exit(1);
      }
    }

    saveConfig({ [key]: value });
    console.log(chalk.green(`✓ Set ${key} = ${key === 'apiKey' ? '****' : value}`));
  });

// Get config value
configCommand
  .command('get <key>')
  .description('Get a configuration value')
  .action((key) => {
    const config = getConfig();
    const configRecord = config as unknown as Record<string, unknown>;
    const value = configRecord[key];

    if (value === undefined) {
      console.error(chalk.red(`Unknown key: ${key}`));
      process.exit(1);
    }

    console.log(value);
  });

// Reset config
configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .option('-f, --force', 'Skip confirmation')
  .action((options) => {
    if (!options.force) {
      console.log(chalk.yellow('\n⚠ This will reset all configuration to defaults.'));
      console.log(chalk.gray('Use --force to skip this confirmation.\n'));
      process.exit(1);
    }

    const resetConfig: Partial<CLIConfig> = {
      apiUrl: 'http://localhost:8000',
      defaultMode: 'QUALITY',
      outputFormat: 'text',
    };
    saveConfig(resetConfig);

    console.log(chalk.green('✓ Configuration reset to defaults'));
  });

// Show config path
configCommand
  .command('path')
  .description('Show configuration file path')
  .action(() => {
    console.log(getConfigPath());
  });
