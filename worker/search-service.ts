import type { AppContext, Movie, SimilarVectorSearchOptions } from "./types";

const ML_MODEL = "@cf/google/embeddinggemma-300m";

interface MovieDbRow {
  id: number;
  title: string;
  overview: string;
  release_year: number;
  imdb_rating: number;
  genre: string;
  poster_link: string;
}

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

async function fetchByIds(ctx: AppContext, ids: number[]): Promise<Movie[]> {
  const placeholders = ids.map(() => "?").join(",");
  const query = `
    SELECT * FROM movies
    WHERE id IN (${placeholders})
  `;

  const { results } = await ctx.env.db
    .prepare(query)
    .bind(...ids)
    .run<MovieDbRow>();

  return results.map((v) => ({
    id: v.id,
    title: v.title,
    overview: v.overview,
    genre: v.genre,
    year: v.release_year,
    imdbRating: v.imdb_rating,
    posterLink: v.poster_link,
  }));
}

export default {
  getSimilarMovieIds,
  fetchByIds,
};
