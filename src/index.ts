import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { pool } from "./db.js";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/orders", async (c) => {
  const raw = c.req.query("userId");
  if (raw === undefined || raw === "") {
    return c.json({ error: "userId is required" }, 400);
  }

  const userId = Number.parseInt(raw, 10);
  if (!Number.isInteger(userId) || userId <= 0) {
    return c.json({ error: "userId must be a positive integer" }, 400);
  }

  const result = await pool.query<{
    id: number;
    user_id: number;
    total: string;
    created_at: Date;
  }>(
    `SELECT id, user_id, total, created_at
     FROM orders
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 20`,
    [userId],
  );

  return c.json({
    userId,
    orders: result.rows.map((row) => ({
      id: Number(row.id),
      userId: Number(row.user_id),
      total: Number(row.total),
      createdAt: row.created_at,
    })),
  });
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`listening on http://127.0.0.1:${info.port}`);
});
