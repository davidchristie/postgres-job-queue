import { PoolClient } from "pg";
import { Job } from "../../types";
import { parseJobRow } from "../utilities/parse-job-row";

export async function updateJobStatus(
  client: PoolClient,
  input: {
    id: number;
    status: Exclude<Job["status"], "pending">;
  }
): Promise<Job> {
  const result = await client.query(
    `
      update jobs
      set status = $2
      where id = $1
      returning id, created_at, queue, status;
    `,
    [input.id, input.status]
  );
  return parseJobRow(result.rows[0]);
}
