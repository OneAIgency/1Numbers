/**
 * Result Aggregator
 * Collects and aggregates task execution results
 */

import type { TaskResult } from '../types/index.js';

export class ResultAggregator {
  private results: Map<string, TaskResult> = new Map();
  private errors: Map<string, Error> = new Map();
  private startTime: number = Date.now();

  /**
   * Add a successful result
   */
  addResult(taskId: string, result: TaskResult): void {
    this.results.set(taskId, result);
  }

  /**
   * Add an error
   */
  addError(taskId: string, error: Error | unknown): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.errors.set(taskId, errorObj);
  }

  /**
   * Generate final report
   */
  generateReport(): {
    completed: number;
    failed: number;
    totalTime: number;
    results: TaskResult[];
    errors: Array<{ taskId: string; error: string }>;
  } {
    const totalTime = (Date.now() - this.startTime) / 1000; // seconds

    return {
      completed: this.results.size,
      failed: this.errors.size,
      totalTime: Math.round(totalTime),
      results: Array.from(this.results.values()),
      errors: Array.from(this.errors.entries()).map(([taskId, error]) => ({
        taskId,
        error: error.message,
      })),
    };
  }

  /**
   * Get result for a specific task
   */
  getResult(taskId: string): TaskResult | undefined {
    return this.results.get(taskId);
  }

  /**
   * Check if task has error
   */
  hasError(taskId: string): boolean {
    return this.errors.has(taskId);
  }

  /**
   * Clear all results
   */
  clear(): void {
    this.results.clear();
    this.errors.clear();
    this.startTime = Date.now();
  }
}

