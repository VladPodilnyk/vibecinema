import type { Movie } from "../../worker/types";
import { Card } from "./card";
import { Spinner } from "./spinner";

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
          <div className="space-y-4">
            {movies.map((movie, index) => (
              <Card
                key={movie.id}
                className="p-6 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {movie.title}
                      </h3>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {movie.genre}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{movie.overview}</p>
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
