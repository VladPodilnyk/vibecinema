import type { Movie } from "../../worker/types";
import { MovieList } from "./movie-list";
import { SearchError } from "./search-error";
import { Spinner } from "./spinner";

interface SearchResultsProps {
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
}

export function SearchResults({
  movies,
  isLoading,
  isError,
}: SearchResultsProps) {
  if (movies.length === 0) {
    return null;
  }

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  } else if (isError) {
    content = <SearchError />;
  } else {
    content = <MovieList movies={movies} />;
  }

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {content}
    </div>
  );
}
