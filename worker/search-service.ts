import type { AppContext, Movie, SimilarVectorSearchOptions } from "./types";

const ML_MODEL = "@cf/google/embeddinggemma-300m";

async function getSimilarMovieIds(
  ctx: AppContext,
  query: string,
  options?: SimilarVectorSearchOptions
): Promise<string[]> {
  const topK = options?.topK ?? 10;
  const vector = await ctx.env.ai.run(ML_MODEL, { text: query });
  const similar = await ctx.env.vectorize.query(vector.data[0], { topK });

  if (similar.matches.length === 0) {
    return [];
  }

  const result = new Array<string>(similar.matches.length);
  for (let i = 0; i < similar.matches.length; i++) {
    result[i] = similar.matches[i].id;
  }

  return result;
}

async function fetchByIds(ctx: AppContext, ids: string[]): Promise<Movie[]> {
  const placeholders = ids.map(() => "?").join(",");
  const query = `
    SELECT * FROM movies
    WHERE id IN (${placeholders})
  `;

  const { results } = await ctx.env.db
    .prepare(query)
    .bind(...ids)
    .run<Movie>();

  return results;
}

export default {
  getSimilarMovieIds,
  fetchByIds,
};
