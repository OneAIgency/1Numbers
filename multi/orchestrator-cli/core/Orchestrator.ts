/**
 * Main Orchestrator Class
 * Coordinates multi-agent task execution
 */

import { TaskDecomposer } from './TaskDecomposer.js';
import { WorkerPool } from './WorkerPool.js';
import { TaskQueue } from './TaskQueue.js';
import { ResultAggregator } from './ResultAggregator.js';
import type { Task, TaskPhase, ExecutionPlan, OrchestratorConfig } from '../types/index.js';

export class Orchestrator {
  private decomposer: TaskDecomposer;
  private workerPool: WorkerPool;
  private taskQueue: TaskQueue;
  private aggregator: ResultAggregator;
  private config: OrchestratorConfig;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.decomposer = new TaskDecomposer();
    this.workerPool = new WorkerPool(config.maxParallelWorkers);
    this.taskQueue = new TaskQueue();
    this.aggregator = new ResultAggregator();
  }

  /**
   * Execute a single task
   */
  async executeTask(taskDescription: string): Promise<void> {
    console.log(`\n📋 Analyzing task: ${taskDescription}\n`);

    // Step 1: Analyze and decompose
    const plan = await this.decomposer.decompose(taskDescription);
    this.printPlan(plan);

    // Step 2: Execute phases
    for (const phase of plan.phases) {
      await this.executePhase(phase);
    }

    // Step 3: Aggregate results
    const report = this.aggregator.generateReport();
    this.printReport(report);
  }

  /**
   * Execute tasks from a file
   */
  async executeFromFile(filePath: string): Promise<void> {
    // TODO: Implement file-based task execution
    throw new Error('Not implemented yet');
  }

  /**
   * Interactive mode
   */
  async interactive(): Promise<void> {
    // TODO: Implement interactive CLI
    console.log('Interactive mode - coming soon');
  }

  /**
   * Execute a single phase
   */
  private async executePhase(phase: TaskPhase): Promise<void> {
    console.log(`\n🚀 PHASE ${phase.number}: ${phase.name}`);
    console.log(`   Mode: ${phase.parallel ? 'PARALLEL' : 'SEQUENTIAL'}`);
    console.log(`   Tasks: ${phase.tasks.length}\n`);

    if (phase.parallel) {
      // Execute tasks in parallel
      const promises = phase.tasks.map(task => 
        this.workerPool.executeTask(task)
      );
      const results = await Promise.allSettled(promises);
      
      // Process results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.aggregator.addResult(phase.tasks[index].id, result.value);
        } else {
          this.aggregator.addError(phase.tasks[index].id, result.reason);
        }
      });
    } else {
      // Execute tasks sequentially
      for (const task of phase.tasks) {
        try {
          const result = await this.workerPool.executeTask(task);
          this.aggregator.addResult(task.id, result);
        } catch (error) {
          this.aggregator.addError(task.id, error);
        }
      }
    }

    // Verify phase
    const verification = await this.verifyPhase(phase);
    if (!verification.passed && phase.required) {
      throw new Error(`Phase ${phase.number} verification failed`);
    }
  }

  /**
   * Verify a phase
   */
  private async verifyPhase(phase: TaskPhase): Promise<{ passed: boolean; errors: string[] }> {
    // TODO: Implement verification logic
    return { passed: true, errors: [] };
  }

  /**
   * Print execution plan
   */
  private printPlan(plan: ExecutionPlan): void {
    console.log('═══════════════════════════════════════════');
    console.log('           EXECUTION PLAN');
    console.log('═══════════════════════════════════════════\n');
    
    console.log(`📊 Summary:`);
    console.log(`   Total phases: ${plan.phases.length}`);
    console.log(`   Total tasks: ${plan.totalTasks}`);
    console.log(`   Estimated time: ${plan.estimatedTime}m\n`);

    plan.phases.forEach((phase, index) => {
      console.log(`Phase ${index + 1}: ${phase.name}`);
      console.log(`   Mode: ${phase.parallel ? 'PARALLEL' : 'SEQUENTIAL'}`);
      console.log(`   Tasks:`);
      phase.tasks.forEach(task => {
        console.log(`     - [${task.agent}] ${task.description}`);
      });
      console.log('');
    });
  }

  /**
   * Print final report
   */
  private printReport(report: any): void {
    console.log('\n═══════════════════════════════════════════');
    console.log('           EXECUTION REPORT');
    console.log('═══════════════════════════════════════════\n');
    
    console.log(`✅ Completed: ${report.completed}`);
    console.log(`❌ Failed: ${report.failed}`);
    console.log(`⏱️  Total time: ${report.totalTime}s\n`);
  }

  /**
   * Cleanup resources
   */
  async shutdown(): Promise<void> {
    await this.workerPool.shutdown();
  }
}

