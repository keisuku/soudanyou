"use client";

import Link from "next/link";
import type { Wine } from "@/types/wine";
import { cn, formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Star, UtensilsCrossed } from "lucide-react";

const wineTypeColors: Record<Wine["type"], string> = {
  red: "#7B2D3B",
  white: "#8A7A3E",
  rose: "#9E5A6E",
  sparkling: "#3D7A8A",
};

const wineTypeLabels: Record<Wine["type"], string> = {
  red: "赤",
  white: "白",
  rose: "ロゼ",
  sparkling: "泡",
};

const storeIcons: Record<string, string> = {
  seven: "7",
  lawson: "L",
  familymart: "F",
  aeon: "A",
  summit: "S",
  ozeki: "大",
  seijoishii: "成",
  kaldi: "K",
  life: "LF",
  kakuyasu: "カ",
  yamaya: "Y",
  biccamera: "B",
  liquorman: "リ",
  rakuten: "楽",
  africaer: "ア",
  ginza_grandmarche: "銀",
  takamura: "タ",
  felicity: "フ",
  wine_ohashi: "お",
  ukiuki: "う",
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
          "group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        {/* Thin color accent line */}
        <div className="h-0.5" style={{ backgroundColor: wineTypeColors[wine.type] }} />

        <CardContent className="p-4">
          {/* Top: rank + type + price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {rank != null && (
                <span className="text-[11px] font-bold tabular-nums text-muted-foreground">
                  #{rank}
                </span>
              )}
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                {wineTypeLabels[wine.type]} {wine.abv}%
              </span>
            </div>
            <span className="text-base font-bold tabular-nums text-primary">
              {formatPrice(wine.price)}
            </span>
          </div>

          {/* Name */}
          <h3 className="mt-2 font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {wine.nameJa}
          </h3>

          {/* Why buy now */}
          <p className="mt-1 text-sm leading-snug text-muted-foreground line-clamp-2">
            {wine.whyBuyNow}
          </p>

          {/* Vivino + pairings */}
          <div className="mt-3 flex items-center justify-between">
            {wine.vivinoScore && (
              <span className="flex items-center gap-0.5 text-sm font-medium text-gold">
                <Star className="h-3.5 w-3.5 fill-gold" />
                {wine.vivinoScore.toFixed(1)}
              </span>
            )}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <UtensilsCrossed className="h-3 w-3" />
              {wine.pairings.slice(0, 2).map((p) => (
                <span key={p} className="rounded bg-secondary px-1.5 py-0.5">{p}</span>
              ))}
            </div>
          </div>

          {/* Store availability icons */}
          <div className="mt-2 flex gap-1">
            {wine.stores.map((s) => (
              <span
                key={s.type}
                className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[8px] font-bold text-muted-foreground"
                title={s.name}
              >
                {storeIcons[s.type] ?? "?"}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
