import { useEffect, useState } from "react";
import { SearchBar } from "./components/search-bar";
import { SearchResults } from "./components/search-results";
import { useSearchParams } from "react-router";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    setSearchParams(`/?q=${encodeURIComponent(query)}`);
    setSearchQuery(query);
    setIsSearching(true);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

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
                What mood do you have today?
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover content that matches how you feel
              </p>
            </div>
          )}

          <SearchBar onSearch={handleSearch} />

          {isSearching && (
            <SearchResults query={searchQuery} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
