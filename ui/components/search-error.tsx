export function SearchError() {
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-16 px-6">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Couldn't find movies
        </h3>
        <p className="mb-6 text-center text-muted-foreground max-w-md text-balance">
          We had trouble searching for movies that match your vibe. This is
          because your vibe is unmatched! Please check your connection and try
          again later...
        </p>
      </div>
    </div>
  );
}
