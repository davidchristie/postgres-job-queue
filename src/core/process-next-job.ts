import { pool } from "../db/pool";
import { beginTransaction } from "../db/queries/begin-transaction";
import { commitTransaction } from "../db/queries/commit-transaction";
import { createExecution } from "../db/queries/create-execution";
import { rollbackTransaction } from "../db/queries/rollback-transaction";
import { selectNextJob } from "../db/queries/select-next-job";
import { updateJobStatus } from "../db/queries/update-job-status";
import { Job } from "../types";
import { logTimeTaken } from "../utilities/log-time-taken";

const logPrefix = "  - ";

export async function processNextJob(): Promise<Job | null> {
  const client = await pool.connect();
  try {
    await logTimeTaken(beginTransaction, logPrefix)(client);
    const currentJob = await logTimeTaken(selectNextJob, logPrefix)(client);
    if (currentJob === null) {
      return null;
    }
    console.log("Processing job:", currentJob.id);
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