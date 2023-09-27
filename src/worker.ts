import { workerData } from "node:worker_threads";
import { processAllJobs } from "./core/process-all-jobs";

const { queue } = workerData;

console.log("Worker thread started:", queue);

processAllJobs(queue);
