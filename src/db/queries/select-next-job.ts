import { PoolClient } from "pg";
import { Job } from "../../types";
import { parseJobRow } from "../utilities/parse-job-row";

export async function selectNextJob(client: PoolClient): Promise<Job | null> {
  const result = await client.query(
    `
      select
        id,
        created_at,
        queue,
        status
      from jobs
      where status = 'pending'
      order by created_at asc
      for update skip locked
      limit 1
    `
  );
  if (result.rows.length === 0) {
    return null;
  }
  return parseJobRow(result.rows[0]);
}
