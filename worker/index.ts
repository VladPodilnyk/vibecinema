import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { searchQuerySchema, type Bindings, type Movie } from "./types";
import searchService from "./search-service";

const app = new Hono<{ Bindings: Bindings }>().get(
  "/vibe",
  zValidator("query", searchQuerySchema),
  async (c) => {
    const movieVibe = c.req.valid("query");
    const similar = await searchService.getSimilarMovieIds(c, movieVibe.q);

    if (similar.length === 0) {
      return c.json({ movies: [] as Movie[] });
    }

    const movies = await searchService.fetchByIds(c, similar);
    return c.json({ movies: movies });
  }
);

export type AppType = typeof app;
export default app;
