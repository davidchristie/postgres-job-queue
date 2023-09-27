import { Job } from "../types";
import { processNextJob } from "./process-next-job";

export async function processAllJobs(options: {
  queue: string;
  logPrefix?: string;
}): Promise<void> {
  let job: Job | null = null;
  do {
    job = await processNextJob(options);
  } while (job !== null);
}
