import { Card } from "./card";
import { Spinner } from "./spinner";

interface SearchResultsProps {
  query: string;
  isLoading: boolean;
}

export function SearchResults({ query, isLoading }: SearchResultsProps) {
  const mockResults = [
    {
      id: 1,
      title: "Uplifting Playlist",
      description: "Perfect for your current mood",
      category: "Music",
    },
    {
      id: 2,
      title: "Feel-Good Movies",
      description: "Movies that match your vibe",
      category: "Entertainment",
    },
    {
      id: 3,
      title: "Mood Journal Prompts",
      description: "Reflect on your emotions",
      category: "Wellness",
    },
    {
      id: 4,
      title: "Activities for Your Mood",
      description: "Things to do right now",
      category: "Activities",
    },
  ];

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner className="h-12 w-12 text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">
            Finding content for "{query}"...
          </p>
        </div>
      ) : (
        <>
          <h2 className="mb-6 text-2xl font-semibold text-foreground">
            Results for "{query}"
          </h2>
          <div className="space-y-4">
            {mockResults.map((result, index) => (
              <Card
                key={result.id}
                className="p-6 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {result.title}
                      </h3>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {result.description}
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
