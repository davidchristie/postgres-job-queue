import { pool } from "../db/pool";
import { beginTransaction } from "../db/queries/begin-transaction";
import { commitTransaction } from "../db/queries/commit-transaction";
import { createExecution } from "../db/queries/create-execution";
import { rollbackTransaction } from "../db/queries/rollback-transaction";
import { selectNextJob } from "../db/queries/select-next-job";
import { updateJobStatus } from "../db/queries/update-job-status";
import { Job } from "../types";
import { logTimeTaken } from "../utilities/log-time-taken";

export async function processNextJob(options: {
  queue: string;
  logPrefix?: string;
}): Promise<Job | null> {
  const { queue, logPrefix = "" } = options;
  const client = await pool.connect();
  try {
    await logTimeTaken(beginTransaction, logPrefix)(client);
    const currentJob = await logTimeTaken(selectNextJob, logPrefix)(client, {
      queue,
    });
    if (currentJob === null) {
      return null;
    }
    console.log(`${logPrefix}Processing job:`, currentJob.id);
    await logTimeTaken(createExecution, logPrefix)(client, {
      jobId: currentJob.id,
    });
    const completedJob = await logTimeTaken(updateJobStatus, logPrefix)(
      client,
      {
        id: currentJob.id,
        status: "complete",
      }
    );
    await logTimeTaken(commitTransaction, logPrefix)(client);
    return completedJob;
  } catch (error) {
    await logTimeTaken(rollbackTransaction, logPrefix)(client);
    console.log("ERROR:", error);
    throw error;
  } finally {
    client.release();
  }
}
