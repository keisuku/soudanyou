"use client";

import type { WinePrice } from "@/types/wine";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PriceComparisonProps {
  prices: WinePrice[];
  className?: string;
}

export function PriceComparison({ prices, className }: PriceComparisonProps) {
  if (prices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        価格情報がありません。
      </p>
    );
  }

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const cheapestPrice = sortedPrices[0].price;

  return (
    <div className={cn("space-y-2", className)}>
      {sortedPrices.map((priceEntry, index) => {
        const isCheapest = priceEntry.price === cheapestPrice;

        return (
          <div
            key={`${priceEntry.source}-${index}`}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3 transition-colors",
              isCheapest
                ? "border-gold/50 bg-gold/5"
                : "border-border bg-card"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Source name */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {priceEntry.sourceName}
                  </span>
                  {isCheapest && (
                    <Badge variant="gold" className="text-[10px]">
                      最安値
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  更新: {formatDate(priceEntry.lastUpdated)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* In-stock badge */}
              {priceEntry.inStock ? (
                <Badge variant="secondary" className="text-[10px]">
                  在庫あり
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-[10px]">
                  在庫なし
                </Badge>
              )}

              {/* Price */}
              <span
                className={cn(
                  "text-lg font-bold",
                  isCheapest ? "text-gold" : "text-foreground"
                )}
              >
                {formatPrice(priceEntry.price)}
              </span>

              {/* External link */}
              <a
                href={priceEntry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                外部サイトで購入
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
