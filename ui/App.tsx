import { useCallback, useEffect } from "react";
import { SearchBar } from "./components/search-bar";
import { SearchResults } from "./components/search-results";
import { useSearchParams } from "react-router";
import { useVibe } from "./hooks/useVibe";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { movies, isError, isLoading, vibe } = useVibe();

  const query = searchParams.get("q");
  const isSearching = Boolean(query);

  useEffect(() => {
    if (query) {
      vibe(query);
    }
  }, [searchParams]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchParams({ q: query });
    },
    [searchParams]
  );

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`transition-all duration-700 ease-in-out ${
          isSearching ? "py-6" : "flex min-h-screen items-center justify-center"
        }`}
      >
        <div className="w-full max-w-4xl px-6">
          {!isSearching && (
            <div className="mb-12 text-center animate-in fade-in duration-700">
              <h1 className="mb-4 text-6xl font-bold tracking-tight text-foreground text-balance">
                What vibe do you have today?
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover movies that match your mood
              </p>
            </div>
          )}

          <SearchBar onSearch={handleSearch} />
          <SearchResults
            movies={movies}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
