import type { TrendItem } from "@/types/wine";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendListProps {
  trends: TrendItem[];
}

export function TrendList({ trends }: TrendListProps) {
  return (
    <div className="space-y-3">
      {trends.map((trend, index) => (
        <div
          key={trend.keyword}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
        >
          {/* Rank */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
            {index + 1}
          </span>

          {/* Keyword and wines */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{trend.keyword}</p>
            <p className="truncate text-xs text-muted-foreground">
              {trend.wines.join(", ")}
            </p>
          </div>

          {/* Count */}
          <span className="shrink-0 text-sm text-muted-foreground">
            {trend.count.toLocaleString()} 件
          </span>

          {/* Change */}
          <span
            className={`flex shrink-0 items-center gap-1 text-sm font-medium ${
              trend.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.change >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {trend.change >= 0 ? "+" : ""}
            {trend.change}%
          </span>
        </div>
      ))}
    </div>
  );
}
