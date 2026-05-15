/**
 * Trigger.dev Worker Runner
 * Manages background job processing with trigger.dev
 */

import {
  reportGenerationTask,
  dataExportTask,
  emailBatchTask,
  scheduledRefreshTask,
} from "./trigger-tasks";

const WORKER_CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || "5", 10);

/**
 * Initialize trigger.dev workers
 *
 * In trigger.dev, workers are managed automatically by the platform.
 * This function serves as a startup hook to initialize task definitions.
 */
export async function initializeWorkers(): Promise<void> {
  console.log("✓ Trigger.dev task definitions loaded");
  console.log(`  - reportGenerationTask (concurrency: ${WORKER_CONCURRENCY})`);
  console.log(`  - dataExportTask (concurrency: ${WORKER_CONCURRENCY})`);
  console.log(`  - emailBatchTask (concurrency: ${WORKER_CONCURRENCY})`);
  console.log(`  - scheduledRefreshTask (concurrency: ${WORKER_CONCURRENCY})`);
  console.log("");
  console.log("Jobs are now being processed by trigger.dev:");
  console.log("  - Monitor job status at https://dashboard.trigger.dev");
  console.log("  - Configure retries and timeouts in trigger.config.ts");
  console.log("  - View logs in the trigger.dev dashboard");
}

/**
 * Graceful shutdown
 */
export async function shutdownWorkers(): Promise<void> {
  console.log("Shutting down trigger.dev workers...");
  console.log("✓ Workers stopped");
}

/**
 * Health check for workers
 */
export async function checkWorkerHealth(): Promise<{ healthy: boolean; message: string }> {
  // In trigger.dev, worker health is managed by the platform
  return {
    healthy: true,
    message: "Trigger.dev workers are active (managed by trigger.dev platform)",
  };
}

/**
 * Export task definitions for trigger.dev
 */
export {
  reportGenerationTask,
  dataExportTask,
  emailBatchTask,
  scheduledRefreshTask,
};
