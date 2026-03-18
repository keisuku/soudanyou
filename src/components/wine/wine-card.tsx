"use client";

import Link from "next/link";
import type { Wine } from "@/types/wine";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RatingBadge } from "@/components/wine/rating-badge";

const wineTypeColors: Record<Wine["type"], string> = {
  red: "#722f37",
  white: "#f5e6c8",
  rose: "#e8a0b4",
  sparkling: "#e8d5b0",
  dessert: "#d4a574",
};

const wineTypeLabels: Record<Wine["type"], string> = {
  red: "赤",
  white: "白",
  rose: "ロゼ",
  sparkling: "スパークリング",
  dessert: "デザート",
};

interface WineCardProps {
  wine: Wine;
  className?: string;
}

export function WineCard({ wine, className }: WineCardProps) {
  const bestPrice = wine.prices.length > 0
    ? wine.prices.reduce((min, p) => (p.price < min.price ? p : min), wine.prices[0])
    : null;

  return (
    <Link href={`/wines/${wine.id}`}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:shadow-lg hover:shadow-primary/10",
          className
        )}
      >
        <CardContent className="p-4">
          {/* Wine type indicator and name */}
          <div className="flex items-start gap-3">
            <span
              className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: wineTypeColors[wine.type] }}
              title={wineTypeLabels[wine.type]}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">
                {wine.nameJa}
              </h3>
              {wine.vintage && (
                <span className="text-sm text-muted-foreground">{wine.vintage}</span>
              )}
            </div>
          </div>

          {/* Region and country */}
          <p className="mt-2 text-sm text-muted-foreground">
            {wine.region}、{wine.country}
          </p>

          {/* Grape varieties */}
          {wine.grapeVarieties.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {wine.grapeVarieties.map((grape) => (
                <Badge key={grape} variant="secondary" className="text-[10px]">
                  {grape}
                </Badge>
              ))}
            </div>
          )}

          {/* Best price */}
          {bestPrice && (
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-lg font-bold text-primary">
                {formatPrice(bestPrice.price)}
              </span>
              <span className="text-xs text-muted-foreground">
                {bestPrice.sourceName}
              </span>
            </div>
          )}

          {/* Ratings row */}
          <div className="mt-3 flex items-center gap-2">
            <RatingBadge source="Vivino" score={wine.ratings.vivino} maxScore={5} />
            <RatingBadge source="Wine Searcher" score={wine.ratings.wineSearcher} maxScore={100} />
            <RatingBadge source="CellarTracker" score={wine.ratings.cellarTracker} maxScore={100} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
