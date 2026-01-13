/**
 * Worker Pool
 * Manages parallel task execution using Node.js worker threads
 */

import { Worker } from 'worker_threads';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Task, TaskResult } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface WorkerInfo {
  worker: Worker;
  busy: boolean;
  currentTask?: string;
}

export class WorkerPool {
  private workers: WorkerInfo[] = [];
  private maxWorkers: number;
  private taskQueue: Array<{ task: Task; resolve: (result: TaskResult) => void; reject: (error: Error) => void }> = [];

  constructor(maxWorkers: number) {
    this.maxWorkers = maxWorkers;
    this.initializeWorkers();
  }

  /**
   * Initialize worker pool
   */
  private initializeWorkers(): void {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(join(__dirname, '../workers/taskWorker.js'));
      const workerInfo: WorkerInfo = {
        worker,
        busy: false,
      };

      worker.on('message', (result: TaskResult) => {
        workerInfo.busy = false;
        workerInfo.currentTask = undefined;
        this.processNextTask(workerInfo);
      });

      worker.on('error', (error) => {
        console.error(`Worker ${i} error:`, error);
        workerInfo.busy = false;
        workerInfo.currentTask = undefined;
        this.processNextTask(workerInfo);
      });

      this.workers.push(workerInfo);
    }
  }

  /**
   * Execute a task
   */
  async executeTask(task: Task): Promise<TaskResult> {
    return new Promise((resolve, reject) => {
      // Try to execute immediately if worker available
      const availableWorker = this.workers.find(w => !w.busy);
      
      if (availableWorker) {
        this.runTask(availableWorker, task, resolve, reject);
      } else {
        // Queue task
        this.taskQueue.push({ task, resolve, reject });
      }
    });
  }

  /**
   * Run task on worker
   */
  private runTask(
    workerInfo: WorkerInfo,
    task: Task,
    resolve: (result: TaskResult) => void,
    reject: (error: Error) => void
  ): void {
    workerInfo.busy = true;
    workerInfo.currentTask = task.id;

    const timeout = setTimeout(() => {
      workerInfo.worker.terminate();
      reject(new Error(`Task ${task.id} timed out`));
    }, 300000); // 5 minute timeout

    workerInfo.worker.once('message', (result: TaskResult) => {
      clearTimeout(timeout);
      resolve(result);
    });

    workerInfo.worker.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    workerInfo.worker.postMessage({ type: 'execute', task });
  }

  /**
   * Process next task in queue
   */
  private processNextTask(workerInfo: WorkerInfo): void {
    if (this.taskQueue.length > 0 && !workerInfo.busy) {
      const { task, resolve, reject } = this.taskQueue.shift()!;
      this.runTask(workerInfo, task, resolve, reject);
    }
  }

  /**
   * Shutdown all workers
   */
  async shutdown(): Promise<void> {
    const shutdownPromises = this.workers.map((workerInfo) => {
      return workerInfo.worker.terminate();
    });
    await Promise.all(shutdownPromises);
  }
}

