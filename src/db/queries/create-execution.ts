import { PoolClient } from "pg";
import { Execution } from "../../types";
import { parseExecutionRow } from "../utilities/parse-execution-row";

export async function createExecution(
  client: PoolClient,
  input: Pick<Execution, "jobId">
): Promise<Execution> {
  const result = await client.query(
    `
      insert into executions (job_id)
      values ($1)
      returning id, job_id, timestamp;
    `,
    [input.jobId]
  );
  return parseExecutionRow(result.rows[0]);
}
