/**
 * Project Commands
 *
 * CLI commands for project management.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { resolve } from 'path';
import { api } from '../client/api.js';
import { formatProject, formatProjectList, formatJson } from '../ui/format.js';

export const projectCommand = new Command('project')
  .description('Manage projects');

// Create project
projectCommand
  .command('create')
  .description('Create a new project')
  .requiredOption('-n, --name <name>', 'Project name')
  .option('-p, --path <path>', 'Project path (defaults to current directory)')
  .option('-d, --description <text>', 'Project description')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Creating project...').start();

    try {
      const projectPath = options.path ? resolve(options.path) : process.cwd();

      const project = await api.createProject({
        name: options.name,
        path: projectPath,
        description: options.description,
      });

      spinner.succeed('Project created');

      if (options.json) {
        console.log(formatJson(project));
      } else {
        console.log(formatProject(project));
      }
    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// List projects
projectCommand
  .command('list')
  .description('List all projects')
  .option('-s, --search <text>', 'Search by name or path')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching projects...').start();

    try {
      const result = await api.listProjects(options.search);
      spinner.stop();

      if (options.json) {
        console.log(formatJson(result));
      } else {
        if (result.projects.length === 0) {
          console.log(chalk.gray('\nNo projects found'));
        } else {
          console.log(formatProjectList(result.projects));
          console.log(chalk.gray(`\nTotal: ${result.total} projects`));
        }
      }
    } catch (error) {
      spinner.fail('Failed to list projects');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Get project details
projectCommand
  .command('get <projectId>')
  .description('Get project details')
  .option('--json', 'Output as JSON')
  .action(async (projectId, options) => {
    const spinner = ora('Fetching project...').start();

    try {
      const project = await api.getProject(projectId);
      spinner.stop();

      if (options.json) {
        console.log(formatJson(project));
      } else {
        console.log(formatProject(project));
      }
    } catch (error) {
      spinner.fail('Failed to get project');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Delete project
projectCommand
  .command('delete <projectId>')
  .description('Delete a project')
  .option('-f, --force', 'Skip confirmation')
  .action(async (projectId, options) => {
    if (!options.force) {
      console.log(chalk.yellow('\n⚠ This will delete the project and all associated tasks.'));
      console.log(chalk.gray('Use --force to skip this confirmation.\n'));

      // In a real CLI, we'd use readline for confirmation
      // For now, just require --force
      process.exit(1);
    }

    const spinner = ora('Deleting project...').start();

    try {
      const result = await api.deleteProject(projectId);
      spinner.succeed(result.message);
    } catch (error) {
      spinner.fail('Failed to delete project');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// Initialize project in current directory
projectCommand
  .command('init')
  .description('Initialize a project in the current directory')
  .option('-n, --name <name>', 'Project name')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const cwd = process.cwd();
    const name = options.name || cwd.split('/').pop() || 'unnamed-project';

    const spinner = ora('Initializing project...').start();

    try {
      // Check if project already exists for this path
      const existing = await api.listProjects(cwd);
      const existingProject = existing.projects.find((p) => p.path === cwd);

      if (existingProject) {
        spinner.info('Project already exists for this directory');
        console.log(formatProject(existingProject));
        return;
      }

      // Create new project
      const project = await api.createProject({
        name,
        path: cwd,
        description: `Project initialized from ${cwd}`,
      });

      spinner.succeed('Project initialized');

      if (options.json) {
        console.log(formatJson(project));
      } else {
        console.log(formatProject(project));
        console.log(chalk.gray('\nYou can now run:'));
        console.log(chalk.cyan(`  orchestrator task create -d "Your task" -p ${project.id}`));
      }
    } catch (error) {
      spinner.fail('Failed to initialize project');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });
