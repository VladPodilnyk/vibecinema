import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "./button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full animate-in fade-in duration-700"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all focus-within:shadow-md">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mysterious, sparkling, chill..."
          className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <Button
          type="submit"
          size="lg"
          className="rounded-lg bg-primary px-6 py-2.5 text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
