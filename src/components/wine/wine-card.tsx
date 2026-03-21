"use client";

import Link from "next/link";
import type { Wine } from "@/types/wine";
import { cn, formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const wineTypeColors: Record<Wine["type"], string> = {
  red: "bg-wine-red",
  white: "bg-wine-white",
  rose: "bg-wine-rose",
  sparkling: "bg-wine-sparkling",
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
  return (
    <Link href={`/wines/${wine.id}`}>
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:shadow-lg hover:shadow-primary/10",
          className
        )}
      >
        <CardContent className="p-4">
          {/* Top row: rank + type badge + price + vivino */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {rank != null && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {rank}
                </span>
              )}
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", wineTypeColors[wine.type], wine.type === "red" ? "text-white" : "text-foreground")}>
                {wineTypeLabels[wine.type]}
              </span>
            </div>
            <span className="text-lg font-bold text-primary">
              {formatPrice(wine.price)}
            </span>
          </div>

          {/* Wine name */}
          <h3 className="mt-2 font-semibold leading-tight text-foreground">
            {wine.nameJa}
          </h3>

          {/* Why buy now - the key selling point */}
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            {wine.whyBuyNow}
          </p>

          {/* Bottom row: vivino + pairings */}
          <div className="mt-3 flex items-center justify-between">
            {wine.vivinoScore && (
              <span className="flex items-center gap-0.5 text-sm font-medium text-gold">
                <Star className="h-3.5 w-3.5 fill-gold" />
                {wine.vivinoScore.toFixed(1)}
              </span>
            )}
            <div className="flex gap-1 text-[10px] text-muted-foreground">
              {wine.pairings.slice(0, 2).map((p) => (
                <span key={p} className="rounded bg-secondary px-1.5 py-0.5">{p}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
