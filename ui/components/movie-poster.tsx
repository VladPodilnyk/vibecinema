import { useState } from "react";

interface MoviePosterProps {
  src: string;
  alt: string;
}

export function MoviePoster({ src, alt }: MoviePosterProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-muted to-muted/50 p-4">
        <div className="rounded-full bg-background/80 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <span className="text-center text-xs font-medium text-muted-foreground">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      onError={() => setImageError(true)}
    />
  );
}
