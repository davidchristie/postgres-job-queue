import { PoolClient } from "pg";

export async function rollbackTransaction(client: PoolClient): Promise<void> {
  await client.query("rollback");
}
