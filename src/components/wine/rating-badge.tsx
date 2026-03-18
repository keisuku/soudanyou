import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  source: string;
  score: number | null;
  maxScore?: number;
  className?: string;
}

export function RatingBadge({ source, score, maxScore = 100, className }: RatingBadgeProps) {
  const isVivino = source === "Vivino";
  const isHighScore = score !== null && (
    (isVivino && score >= 4.3) ||
    (!isVivino && score >= 95)
  );

  const displayScore = score !== null
    ? isVivino
      ? score.toFixed(1)
      : score.toString()
    : "N/A";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs",
        isHighScore
          ? "bg-gold/20 text-gold font-semibold"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {isVivino && score !== null && (
        <svg
          className="h-3 w-3 fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      <span>{displayScore}</span>
      <span className="text-[10px] opacity-60">{source}</span>
    </div>
  );
}
