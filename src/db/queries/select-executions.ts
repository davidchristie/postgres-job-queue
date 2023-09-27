import { PoolClient } from "pg";
import { Execution } from "../../types";
import { parseExecutionRow } from "../utilities/parse-execution-row";

export async function selectExecutions(
  client: PoolClient
): Promise<Execution[]> {
  const result = await client.query(
    `
      select id, job_id, timestamp from executions
    `
  );
  return result.rows.map(parseExecutionRow);
}
