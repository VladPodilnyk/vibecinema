import type { Movie } from "../../worker/types";
import { Card } from "./card";
import { Spinner } from "./spinner";

function getRatingColor(rating: number): string {
  if (rating >= 7.5) {
    return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
  }

  if (rating >= 6.0) {
    return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
  }

  return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
}

interface SearchResultsProps {
  movies: Movie[];
  isLoading: boolean;
}

export function SearchResults({ movies, isLoading }: SearchResultsProps) {
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-12 w-12 text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {movies.map((movie, index) => (
              <Card
                key={movie.id}
                className="overflow-hidden transition-all hover:shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={movie.posterLink}
                      alt={`${movie.title} poster`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold leading-tight text-card-foreground">
                        {movie.title}
                      </h3>
                      <span
                        className={`rounded-md border px-2.5 py-1 text-sm font-bold ${getRatingColor(
                          movie.imdbRating
                        )}`}
                      >
                        {movie.imdbRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {movie.genre}
                      </span>
                    </div>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
