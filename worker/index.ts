import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const ML_MODEL = "@cf/google/embeddinggemma-300m";

interface Bindings {
  ai: Ai;
  vectorize: Vectorize;
  db: D1Database;
}

const searchQuerySchema = z.object({ q: z.string().min(1).max(2000) }).strict();

const app = new Hono<{ Bindings: Bindings }>().get(
  "/vibe",
  zValidator("query", searchQuerySchema),
  async (c) => {
    const movieVibe = c.req.valid("query");
    const vector = await c.env.ai.run(ML_MODEL, { text: movieVibe.q });
    const similar = await c.env.vectorize.query(vector.data[0], { topK: 10 });

    let vecId = null;
    if (similar.matches && similar.matches.length > 0 && similar.matches[0]) {
      vecId = similar.matches[0].id;
    } else {
      console.log("No matching vector found or similar.matches is empty");
    }

    if (vecId === null) {
      return c.json({ movies: [] });
    }

    const query = `SELECT * FROM movies WHERE id = ?`;
    const { results } = await c.env.db.prepare(query).bind(vecId).run();
    const movies = results.map((v) => ({
      id: v.id,
      title: v.tile,
      genre: v.genre,
    }));

    return c.json({ movies: movies });
  }
);

export type AppType = typeof app;
export default app;
