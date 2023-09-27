import path = require("node:path");
import { Worker } from "node:worker_threads";
import { pool } from "./db/pool";
import { createJobs } from "./db/queries/create-jobs";

const jobCount = 1000;
const workerCount = 10;
const queue = "dev";

async function dev(): Promise<void> {
  console.log("Creating jobs...");
  const client = await pool.connect();
  await createJobs(client, {
    jobs: Array(jobCount).fill({
      queue,
    }),
  });
  client.release();
  Array(workerCount)
    .fill(null)
    .map(() => {
      new Worker(path.resolve(__dirname, "worker.js"));
    });
}

dev();
