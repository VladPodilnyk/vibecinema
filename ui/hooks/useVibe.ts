import { useCallback, useState } from "react";
import type { Movie } from "../../worker/types";
import client from "../client/api";

export function useVibe() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const vibe = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const q = encodeURIComponent(query);
      const response = await client.vibe.$get({ query: { q } });
      const { movies } = await response.json();
      setMovies(movies);
    } catch (e) {
      setIsError(true);
    } finally {
      // setTimeout(() => setIsLoading(false), 1500);
      setIsLoading(false);
    }
  }, []);

  return {
    movies,
    isLoading,
    isError,
    vibe,
  };
}
