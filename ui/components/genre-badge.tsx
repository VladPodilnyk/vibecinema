interface GenreBadgeProps {
  genre: string;
}

export function GenreBadge({ genre }: GenreBadgeProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {genre
        .split(",")
        .map((v) => v.trim())
        .map((v) => (
          <span
            key={v}
            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {v}
          </span>
        ))}
    </div>
  );
}
