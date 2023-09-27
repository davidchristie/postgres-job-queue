import { Execution } from "../../types";

export function parseExecutionRow(row: {
  id: number;
  job_id: number;
  timestamp: Date;
}): Execution {
  return {
    id: row.id,
    jobId: row.job_id,
    timestamp: row.timestamp,
  };
}
