import { workerData } from "node:worker_threads";
import { processAllJobs } from "./core/process-all-jobs";

async function run() {
  const { workerName, queue } = workerData;
  console.log("Worker thread started:", queue);
  await processAllJobs({
    queue,
    logPrefix: `[${workerName}] `,
  });
}

run();
