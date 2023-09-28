import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
  host: "localhost",
  database: config.postgres.db,
  user: config.postgres.user,
  password: config.postgres.password,
  port: 5432,
  // max: 50, // maximum number of clients in the pool
});
