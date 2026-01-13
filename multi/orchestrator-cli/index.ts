#!/usr/bin/env node
/**
 * Real Multi-Agent Orchestrator
 * Executes tasks in parallel using Node.js worker threads
 */

import { Orchestrator } from './core/Orchestrator.js';
import { parseArgs } from './utils/cli.js';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  
  const orchestrator = new Orchestrator({
    maxParallelWorkers: args.maxWorkers || 4,
    verbose: args.verbose || false,
  });

  try {
    if (args.task) {
      // Single task execution
      await orchestrator.executeTask(args.task);
    } else if (args.file) {
      // Task file execution
      await orchestrator.executeFromFile(args.file);
    } else {
      // Interactive mode
      await orchestrator.interactive();
    }
  } catch (error) {
    console.error('Orchestrator error:', error);
    process.exit(1);
  }
}

main();

