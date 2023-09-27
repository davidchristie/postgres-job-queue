import { Job } from "../../types";

export function parseJobRow(row: {
  id: number;
  created_at: Date;
  queue: string;
  status: "pending" | "complete" | "failed";
}): Job {
  return {
    id: row.id,
    createdAt: new Date(row.created_at),
    queue: row.queue,
    status: row.status,
  };
}
