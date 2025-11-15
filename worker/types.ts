import type { Context } from "hono";
import { z } from "zod";

export interface Bindings {
  ai: Ai;
  vectorize: Vectorize;
  db: D1Database;
}

export type AppContext = Context<{ Bindings: Bindings }>;

export const searchQuerySchema = z
  .object({ q: z.string().min(1).max(2000) })
  .strict();

export interface Movie {
  id: number;
  title: string;
  overview: string;
  year: number;
  imbdRating: number;
  genre: string;
  posterLink: string;
}

export interface SimilarVectorSearchOptions {
  topK?: number;
}
