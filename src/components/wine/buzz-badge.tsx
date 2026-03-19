import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface BuzzBadgeProps {
  score: number;
  size?: "sm" | "md";
  className?: string;
}

function getBuzzLevel(score: number) {
  if (score >= 85) return { label: "バズ中", color: "text-orange-400", bg: "bg-orange-400" };
  if (score >= 70) return { label: "話題", color: "text-yellow-400", bg: "bg-yellow-400" };
  if (score >= 50) return { label: "注目", color: "text-amber-600", bg: "bg-amber-600" };
  return { label: "", color: "text-muted-foreground", bg: "bg-muted-foreground" };
}

export function BuzzBadge({ score, size = "sm", className }: BuzzBadgeProps) {
  const level = getBuzzLevel(score);
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Flame className={cn(iconSize, level.color)} />
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", level.bg)}
            style={{ width: `${score}%` }}
          />
        </div>
        {level.label && (
          <span className={cn(textSize, "font-bold", level.color)}>
            {level.label}
          </span>
        )}
      </div>
    </div>
  );
}
