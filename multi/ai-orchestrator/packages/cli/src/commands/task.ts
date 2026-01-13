/**
 * Task Commands
 *
 * CLI commands for task management.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { api, type Task } from '../client/api.js';
import { wsClient } from '../client/websocket.js';
import { getConfig } from '../client/config.js';
import { formatTask, formatTaskList, formatJson } from '../ui/format.js';

export const taskCommand = new Command('task')
  .description('Manage orchestration tasks');

// Create task
taskCommand
  .command('create')
  .description('Create a new task')
  .requiredOption('-d, --description <text>', 'Task description')
  .option('-m, --mode <mode>', 'Execution mode (SPEED, QUALITY, AUTONOMY, COST)')
  .option('-p, --project <id>', 'Project ID')
  .option('--priority <number>', 'Task priority (0-100)', '0')
  .option('-w, --watch', 'Watch task progress in real-time')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Creating task...').start();

    try {
      const config = getConfig();
      const task = await api.createTask({
        description: options.description,
        mode: options.mode || config.defaultMode,
        project_id: options.project,
        priority: parseInt(options.priority, 10),
      });

      spinner.succeed('Task created');

      if (options.json) {
        console.log(formatJson(task));
      } else {
        console.log(formatTask(task));
      }

      // Watch mode
      if (options.watch) {
        await watchTask(task.id);
      }
    } catch (error) {
      spinner.fail('Failed to create task');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// List tasks
taskCommand
  .command('list')
  .description('List tasks')
  .option('-s, --status <status>', 'Filter by status')
  .option('-m, --mode <mode>', 'Filter by mode')
  .option('-p, --project <id>', 'Filter by project')
  .option('-n, --limit <number>', 'Number of tasks to show', '20')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching tasks...').start();

    try {
      const result = await api.listTasks({
        status: options.status,
        mode: options.mode,
        project_id: options.project,
        page_size: parseInt(options.limit, 10),
      });

      spinner.stop();

      if (options.json) {
        console.log(formatJson(result));
      } else {
        console.log(formatTaskList(result.tasks));
        console.log(chalk.gray(`\nShowing ${result.tasks.length} of ${result.total} tasks`));
      }
    } catch (error) {
      spinner.fail('Failed to list tasks');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Get task details
taskCommand
  .command('get <taskId>')
  .description('Get task details')
  .option('--json', 'Output as JSON')
  .action(async (taskId, options) => {
    const spinner = ora('Fetching task...').start();

    try {
      const task = await api.getTask(taskId);
      spinner.stop();

      if (options.json) {
        console.log(formatJson(task));
      } else {
        console.log(formatTask(task, true));
      }
    } catch (error) {
      spinner.fail('Failed to get task');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Watch task
taskCommand
  .command('watch <taskId>')
  .description('Watch task progress in real-time')
  .action(async (taskId) => {
    await watchTask(taskId);
  });

// Cancel task
taskCommand
  .command('cancel <taskId>')
  .description('Cancel a pending or running task')
  .action(async (taskId) => {
    const spinner = ora('Cancelling task...').start();

    try {
      const result = await api.cancelTask(taskId);
      spinner.succeed(result.message);
    } catch (error) {
      spinner.fail('Failed to cancel task');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Retry task
taskCommand
  .command('retry <taskId>')
  .description('Retry a failed task')
  .option('-w, --watch', 'Watch task progress')
  .action(async (taskId, options) => {
    const spinner = ora('Retrying task...').start();

    try {
      const task = await api.retryTask(taskId);
      spinner.succeed('Task queued for retry');
      console.log(formatTask(task));

      if (options.watch) {
        await watchTask(task.id);
      }
    } catch (error) {
      spinner.fail('Failed to retry task');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Helper: Watch task progress
async function watchTask(taskId: string): Promise<void> {
  console.log(chalk.blue(`\nWatching task ${taskId}...`));
  console.log(chalk.gray('Press Ctrl+C to stop\n'));

  try {
    await wsClient.connect();
    wsClient.subscribe(`task:${taskId}`);

    // Handle task events
    wsClient.on('task_started', (msg) => {
      if (msg.task_id === taskId) {
        console.log(chalk.yellow('▶ Task started'));
      }
    });

    wsClient.on('phase_started', (msg) => {
      if (msg.task_id === taskId) {
        const data = msg.data as Record<string, unknown> | undefined;
        const phase = data?.['phase'] as { name: string; number: number } | undefined;
        console.log(chalk.cyan(`  Phase ${phase?.number}: ${phase?.name}`));
      }
    });

    wsClient.on('agent_started', (msg) => {
      if (msg.task_id === taskId) {
        const data = msg.data as Record<string, unknown> | undefined;
        const agent = data?.['agent'];
        console.log(chalk.gray(`    → Running ${agent} agent...`));
      }
    });

    wsClient.on('agent_completed', (msg) => {
      if (msg.task_id === taskId) {
        const data = msg.data as Record<string, unknown> | undefined;
        const execution = data?.['execution'] as { agent_type: string; status: string; duration_ms: number } | undefined;
        const status = execution?.status === 'completed' ? chalk.green('✓') : chalk.red('✗');
        console.log(`    ${status} ${execution?.agent_type} (${execution?.duration_ms}ms)`);
      }
    });

    wsClient.on('task_completed', async (msg) => {
      if (msg.task_id === taskId) {
        console.log(chalk.green('\n✓ Task completed successfully'));

        // Fetch and display final result
        const task = await api.getTask(taskId);
        console.log(chalk.gray(`\nTokens used: ${task.tokens_used}`));
        console.log(chalk.gray(`Cost: $${task.estimated_cost.toFixed(4)}`));

        wsClient.disconnect();
        process.exit(0);
      }
    });

    wsClient.on('task_failed', async (msg) => {
      if (msg.task_id === taskId) {
        console.log(chalk.red('\n✗ Task failed'));

        const task = await api.getTask(taskId);
        if (task.errors.length > 0) {
          console.log(chalk.red('\nErrors:'));
          task.errors.forEach((err) => {
            console.log(chalk.red(`  - ${err.message}`));
          });
        }

        wsClient.disconnect();
        process.exit(1);
      }
    });

    // Keep alive
    await new Promise(() => {});
  } catch (error) {
    console.error(chalk.red('Failed to connect to WebSocket'));
    console.error(chalk.red((error as Error).message));
    process.exit(1);
  }
}
