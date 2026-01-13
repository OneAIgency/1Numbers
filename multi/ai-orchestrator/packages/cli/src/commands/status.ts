/**
 * Status Commands
 *
 * CLI commands for system status and monitoring.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { api } from '../client/api.js';
import { formatJson } from '../ui/format.js';

export const statusCommand = new Command('status')
  .description('System status and monitoring');

// Overall status
statusCommand
  .command('overview')
  .description('Get system overview')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching system status...').start();

    try {
      const [health, stats, currentMode] = await Promise.all([
        api.healthCheck(),
        api.getStats(),
        api.getCurrentMode(),
      ]);

      spinner.stop();

      if (options.json) {
        console.log(formatJson({ health, stats, currentMode }));
        return;
      }

      // Health
      console.log(chalk.bold('\n🏥 System Health'));
      console.log(chalk.gray('─'.repeat(40)));

      const statusIcon = (status: string) =>
        status === 'healthy' ? chalk.green('●') : chalk.red('●');

      console.log(`  Overall:   ${statusIcon(health.status)} ${health.status}`);
      console.log(`  Database:  ${statusIcon(health.database.status)} ${health.database.status}`);
      console.log(`  Cache:     ${statusIcon(health.cache.status)} ${health.cache.status}`);
      console.log(`  Claude:    ${statusIcon(health.claude.status)} ${health.claude.status}`);
      console.log(`  Ollama:    ${statusIcon(health.ollama.status)} ${health.ollama.status}`);

      // Current Mode
      console.log(chalk.bold('\n⚡ Current Mode'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(`  Mode:         ${chalk.cyan(currentMode.mode)}`);
      console.log(`  Active Tasks: ${currentMode.active_tasks}`);

      // Stats
      console.log(chalk.bold('\n📊 Task Statistics'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(`  Total:      ${stats.total_tasks}`);
      console.log(`  Completed:  ${chalk.green(stats.completed_tasks)}`);
      console.log(`  Failed:     ${chalk.red(stats.failed_tasks)}`);
      console.log(`  Running:    ${chalk.yellow(stats.running_tasks)}`);
      console.log(`  Success:    ${stats.success_rate.toFixed(1)}%`);

      if (stats.avg_task_duration_ms) {
        console.log(`  Avg Time:   ${(stats.avg_task_duration_ms / 1000).toFixed(1)}s`);
      }

      console.log(chalk.gray(`\n  Version: ${health.version}`));
    } catch (error) {
      spinner.fail('Failed to get system status');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Stats only
statusCommand
  .command('stats')
  .description('Get task statistics')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching statistics...').start();

    try {
      const stats = await api.getStats();
      spinner.stop();

      if (options.json) {
        console.log(formatJson(stats));
      } else {
        console.log(chalk.bold('\n📊 Task Statistics'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`  Total Tasks:     ${stats.total_tasks}`);
        console.log(`  Completed:       ${chalk.green(stats.completed_tasks)}`);
        console.log(`  Failed:          ${chalk.red(stats.failed_tasks)}`);
        console.log(`  Running:         ${chalk.yellow(stats.running_tasks)}`);
        console.log(`  Total Executions: ${stats.total_executions}`);
        console.log(`  Success Rate:    ${stats.success_rate.toFixed(1)}%`);

        if (stats.avg_task_duration_ms) {
          console.log(`  Avg Duration:    ${(stats.avg_task_duration_ms / 1000).toFixed(1)}s`);
        }
      }
    } catch (error) {
      spinner.fail('Failed to get statistics');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Cost tracking
statusCommand
  .command('costs')
  .description('Get cost statistics')
  .option('-d, --days <number>', 'Number of days to look back', '30')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching cost data...').start();

    try {
      const costs = await api.getCosts(parseInt(options.days, 10));
      spinner.stop();

      if (options.json) {
        console.log(formatJson(costs));
      } else {
        console.log(chalk.bold('\n💰 Cost Statistics'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`  Period:          ${new Date(costs.period_start).toLocaleDateString()} - ${new Date(costs.period_end).toLocaleDateString()}`);
        console.log(`  Total Cost:      ${chalk.yellow('$' + costs.total_cost.toFixed(4))}`);
        console.log(`  Tokens Input:    ${costs.total_tokens_input.toLocaleString()}`);
        console.log(`  Tokens Output:   ${costs.total_tokens_output.toLocaleString()}`);

        if (Object.keys(costs.cost_by_provider).length > 0) {
          console.log(chalk.bold('\n  By Provider:'));
          for (const [provider, cost] of Object.entries(costs.cost_by_provider)) {
            console.log(`    ${provider}: $${cost.toFixed(4)}`);
          }
        }

        if (Object.keys(costs.cost_by_model).length > 0) {
          console.log(chalk.bold('\n  By Model:'));
          for (const [model, cost] of Object.entries(costs.cost_by_model)) {
            console.log(`    ${model}: $${cost.toFixed(4)}`);
          }
        }
      }
    } catch (error) {
      spinner.fail('Failed to get cost data');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Health check
statusCommand
  .command('health')
  .description('Check system health')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Checking health...').start();

    try {
      const health = await api.healthCheck();
      spinner.stop();

      if (options.json) {
        console.log(formatJson(health));
      } else {
        const isHealthy = health.status === 'healthy';
        console.log(isHealthy ? chalk.green('\n✓ System is healthy') : chalk.yellow('\n⚠ System is degraded'));

        console.log(chalk.gray(`  Version: ${health.version}`));

        const check = (name: string, status: { status: string }) => {
          const icon = status.status === 'healthy' ? chalk.green('✓') : chalk.red('✗');
          console.log(`  ${icon} ${name}: ${status.status}`);
        };

        check('Database', health.database);
        check('Cache', health.cache);
        check('Claude', health.claude);
        check('Ollama', health.ollama);

        process.exit(isHealthy ? 0 : 1);
      }
    } catch (error) {
      spinner.fail('Health check failed');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Alias for overview
statusCommand.action(async (options) => {
  // Default to overview
  await statusCommand.commands.find((c) => c.name() === 'overview')?.parseAsync(['node', 'status', 'overview']);
});
