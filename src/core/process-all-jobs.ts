import { Job } from "../types";
import { processNextJob } from "./process-next-job";

export async function processAllJobs(): Promise<void> {
  let job: Job | null = null;
  do {
    job = await processNextJob();
  } while (job !== null);
}
