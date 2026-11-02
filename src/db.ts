import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://lab:labpass@127.0.0.1:5432/performance_lab";

const max = Number.parseInt(process.env.DB_POOL_MAX ?? "10", 10);

export const pool = new Pool({
  connectionString,
  max: Number.isFinite(max) && max > 0 ? max : 10,
});

pool.on("error", (err) => {
  console.error("unexpected idle client error", err);
});
