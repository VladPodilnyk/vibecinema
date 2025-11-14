import { Hono } from "hono";

interface Bindings {
  ai: Ai;
  vectorize: Vectorize;
  db: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>().get("/api", async (c) => {
  return c.json({ name: "CF" });
});

export type AppType = typeof app;
export default app;
