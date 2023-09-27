import { PoolClient } from "pg";
import { Job } from "../../types";
import { parseJobRow } from "../utilities/parse-job-row";

export async function selectNextJob(
  client: PoolClient,
  input: { queue: string }
): Promise<Job | null> {
  const result = await client.query(
    `
      select
        id,
        created_at,
        queue,
        status
      from jobs
      where status = 'pending'
      and queue = $1
      order by created_at asc
      for update skip locked
      limit 1
    `,
    [input.queue]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return parseJobRow(result.rows[0]);
}
