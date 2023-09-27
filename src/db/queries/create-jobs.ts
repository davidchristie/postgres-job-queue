import { PoolClient } from "pg";
import { Job } from "../../types";
import { parseJobRow } from "../utilities/parse-job-row";

export async function createJobs(
  client: PoolClient,
  input: {
    jobs: Pick<Job, "queue">[];
  }
): Promise<Job[]> {
  const result = await client.query(
    `
      insert into jobs (queue)
      select * from unnest ($1::text[])
      returning id, created_at, queue, status;
    `,
    [input.jobs.map((job) => job.queue)]
  );
  return result.rows.map(parseJobRow);
}
