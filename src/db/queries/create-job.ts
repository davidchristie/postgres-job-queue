import { PoolClient } from "pg";
import { Job } from "../../types";
import { parseJobRow } from "../utilities/parse-job-row";

export async function createJob(
  client: PoolClient,
  input: { job: Pick<Job, "queue"> }
): Promise<Job> {
  const result = await client.query(
    `
      insert into jobs (queue)
      values ($1)
      returning id, created_at, queue, status;
    `,
    [input.job.queue]
  );
  return parseJobRow(result.rows[0]);
}
