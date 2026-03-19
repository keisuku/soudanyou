"use client";

import Link from "next/link";
import type { Wine } from "@/types/wine";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BuzzBadge } from "@/components/wine/buzz-badge";
import { Star, MapPin } from "lucide-react";

const wineTypeColors: Record<Wine["type"], string> = {
  red: "#722f37",
  white: "#f5e6c8",
  rose: "#e8a0b4",
  sparkling: "#e8d5b0",
};

const wineTypeLabels: Record<Wine["type"], string> = {
  red: "赤",
  white: "白",
  rose: "ロゼ",
  sparkling: "泡",
};

interface WineCardProps {
  wine: Wine;
  rank?: number;
  className?: string;
}

export function WineCard({ wine, rank, className }: WineCardProps) {
  const cheapestStore = wine.stores.reduce((min, s) =>
    s.price < min.price ? s : min, wine.stores[0]);

  return (
    <Link href={`/wines/${wine.id}`}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:shadow-lg hover:shadow-primary/10",
          className
        )}
      >
        <CardContent className="p-4">
          {/* Rank + type + name */}
          <div className="flex items-start gap-3">
            {rank != null && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                {rank}
              </span>
            )}
            <span
              className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: wineTypeColors[wine.type] }}
              title={wineTypeLabels[wine.type]}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground">
                {wine.nameJa}
              </h3>
              <p className="truncate text-xs text-muted-foreground">
                {wine.producer} / {wine.country}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {wine.description}
          </p>

          {/* Tags */}
          {wine.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {wine.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Price + Vivino */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(wine.price)}
            </span>
            {wine.vivinoScore && (
              <span className="flex items-center gap-0.5 text-sm text-gold">
                <Star className="h-3.5 w-3.5 fill-gold" />
                {wine.vivinoScore.toFixed(1)}
              </span>
            )}
          </div>

          {/* Cheapest store */}
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>最安 {cheapestStore.name} {formatPrice(cheapestStore.price)}</span>
          </div>

          {/* Buzz score */}
          <div className="mt-2">
            <BuzzBadge score={wine.buzzScore} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
