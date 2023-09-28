import { workerData } from "node:worker_threads";
import { processAllJobs } from "./core/process-all-jobs";
import { pool } from "./db/pool";

async function run() {
  const { workerName, queue, taskCount = 1 } = workerData;
  console.log("Worker thread started:", queue);
  await Promise.all(
    Array(taskCount)
      .fill(null)
      .map(async (_, index) => {
        const taskName = `task_${index + 1}`;
        await processAllJobs(
          {
            queue,
            logPrefix: `[${workerName}][${taskName}] `,
          },
          async () => {
            // Fake workload
            const durationMs = 9 * 1000 * Math.random() + 1000; // 1-10 seconds
            await new Promise((resolve) => {
              setTimeout(resolve, durationMs);
            });
          }
        );
      })
  );
  await pool.end();
}

run();
