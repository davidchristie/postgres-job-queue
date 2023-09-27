import { PoolClient } from "pg";

export async function commitTransaction(client: PoolClient): Promise<void> {
  await client.query("commit");
}
