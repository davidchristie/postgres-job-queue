export interface Job {
  id: number;
  createdAt: Date;
  queue: string;
  status: "pending" | "complete" | "failed";
}

export interface Execution {
  id: number;
  jobId: number;
  timestamp: Date;
}
