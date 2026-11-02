import "dotenv/config";
import { pool } from "../src/db.js";

/** Phase 0: 少量シード。userId=123 を含め後続の計測で使えるようにする。 */
const SEED_ROWS: Array<{ userId: number; total: number; createdAt: string }> = [
  { userId: 123, total: 1200.0, createdAt: "2024-01-01T10:00:00Z" },
  { userId: 123, total: 3400.5, createdAt: "2024-02-15T12:30:00Z" },
  { userId: 123, total: 890.0, createdAt: "2024-03-20T08:15:00Z" },
  { userId: 123, total: 5600.25, createdAt: "2024-04-05T19:45:00Z" },
  { userId: 123, total: 210.0, createdAt: "2024-05-11T09:00:00Z" },
  { userId: 1, total: 100.0, createdAt: "2024-01-02T11:00:00Z" },
  { userId: 1, total: 250.5, createdAt: "2024-01-03T11:00:00Z" },
  { userId: 42, total: 9999.99, createdAt: "2024-06-01T00:00:00Z" },
  { userId: 42, total: 50.0, createdAt: "2024-06-02T00:00:00Z" },
  { userId: 7, total: 777.77, createdAt: "2024-07-07T07:07:07Z" },
];

async function main() {
  await pool.query("TRUNCATE orders RESTART IDENTITY");

  for (const row of SEED_ROWS) {
    await pool.query(
      `INSERT INTO orders (user_id, total, created_at)
       VALUES ($1, $2, $3)`,
      [row.userId, row.total, row.createdAt],
    );
  }

  const count = await pool.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM orders",
  );
  console.log(`seeded ${count.rows[0]?.count ?? "0"} orders`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
