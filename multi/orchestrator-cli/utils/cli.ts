/**
 * CLI argument parser
 */

export interface CliArgs {
  task?: string;
  file?: string;
  maxWorkers?: number;
  verbose?: boolean;
}

export function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--task' || arg === '-t') {
      result.task = args[++i];
    } else if (arg === '--file' || arg === '-f') {
      result.file = args[++i];
    } else if (arg === '--workers' || arg === '-w') {
      result.maxWorkers = parseInt(args[++i], 10);
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (!arg.startsWith('-')) {
      // Positional argument - treat as task
      result.task = arg;
    }
  }

  return result;
}

