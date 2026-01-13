/**
 * Task Queue
 * Manages task dependencies and execution order
 */

import type { Task } from '../types/index.js';

export class TaskQueue {
  private tasks: Map<string, Task> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();
  private completed: Set<string> = new Set();

  /**
   * Add a task to the queue
   */
  addTask(task: Task): void {
    this.tasks.set(task.id, task);
    
    if (task.dependencies) {
      this.dependencies.set(task.id, new Set(task.dependencies));
    }
  }

  /**
   * Get next available tasks (no dependencies or dependencies completed)
   */
  getAvailableTasks(): Task[] {
    const available: Task[] = [];

    for (const [taskId, task] of this.tasks) {
      if (this.completed.has(taskId)) {
        continue; // Already completed
      }

      const deps = this.dependencies.get(taskId);
      if (!deps || deps.size === 0) {
        // No dependencies
        available.push(task);
      } else {
        // Check if all dependencies are completed
        const allDepsCompleted = Array.from(deps).every(depId => 
          this.completed.has(depId)
        );
        if (allDepsCompleted) {
          available.push(task);
        }
      }
    }

    return available;
  }

  /**
   * Mark task as completed
   */
  markCompleted(taskId: string): void {
    this.completed.add(taskId);
  }

  /**
   * Check if all tasks are completed
   */
  isComplete(): boolean {
    return this.completed.size === this.tasks.size;
  }

  /**
   * Get remaining tasks count
   */
  getRemainingCount(): number {
    return this.tasks.size - this.completed.size;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.tasks.clear();
    this.dependencies.clear();
    this.completed.clear();
  }
}

