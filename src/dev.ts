import path = require("node:path");
import { Worker } from "node:worker_threads";
import { pool } from "./db/pool";
import { createJobs } from "./db/queries/create-jobs";
import { selectExecutions } from "./db/queries/select-executions";

const jobCount = 1000;
const workerCount = 10;
const queue = "dev";

async function dev(): Promise<void> {
  console.log("Creating jobs...");
  let client = await pool.connect();
  await createJobs(client, {
    jobs: Array(jobCount).fill({
      queue,
    }),
  });
  client.release();
  await Promise.all(
    Array(workerCount)
      .fill(null)
      .map((_, index) => {
        return new Promise<void>((resolve, reject) => {
          const workerName = `worker_${index + 1}`;
          const worker = new Worker(path.resolve(__dirname, "worker.js"), {
            workerData: { workerName, queue },
          });
          worker.on("exit", (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Worker exited with code ${code}.`));
            }
          });
        });
      })
  );
  client = await pool.connect();
  const exections = await selectExecutions(client);
  console.log("Total executions:", exections.length);
  console.log(
    "Unique execution job IDs:",
    new Set(exections.map((execution) => execution.jobId)).size
  );
  client.release();
}

dev();
