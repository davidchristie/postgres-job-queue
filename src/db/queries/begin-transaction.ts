import { PoolClient } from "pg";

export async function beginTransaction(client: PoolClient): Promise<void> {
  await client.query("begin");
}
