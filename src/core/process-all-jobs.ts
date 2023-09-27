import { Job } from "../types";
import { processNextJob } from "./process-next-job";

export async function processAllJobs(queue: string): Promise<void> {
  let job: Job | null = null;
  do {
    job = await processNextJob(queue);
  } while (job !== null);
}
