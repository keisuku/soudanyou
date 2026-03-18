"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockWines } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SortOption = "cheapest" | "most_expensive" | "biggest_drop";

const wineTypeLabels: Record<string, string> = {
  red: "赤",
  white: "白",
  rose: "ロゼ",
  sparkling: "泡",
  dessert: "甘口",
};

const wineTypeColors: Record<string, string> = {
  red: "bg-red-100 text-red-800",
  white: "bg-yellow-100 text-yellow-800",
  rose: "bg-pink-100 text-pink-800",
  sparkling: "bg-amber-100 text-amber-800",
  dessert: "bg-orange-100 text-orange-800",
};

function getPriceTrend(wine: (typeof mockWines)[0]) {
  const history = wine.priceHistory;
  if (history.length < 2) return { change: 0, percentage: 0 };
  const oldest = history[0].price;
  const newest = history[history.length - 1].price;
  const change = newest - oldest;
  const percentage = ((change / oldest) * 100).toFixed(1);
  return { change, percentage: parseFloat(percentage) };
}

function getMinPrice(wine: (typeof mockWines)[0]) {
  if (wine.prices.length === 0) return Infinity;
  return Math.min(...wine.prices.map((p) => p.price));
}

export default function PricesPage() {
  const [sortBy, setSortBy] = useState<SortOption>("cheapest");

  const sortedWines = useMemo(() => {
    const wines = [...mockWines];
    switch (sortBy) {
      case "cheapest":
        return wines.sort((a, b) => getMinPrice(a) - getMinPrice(b));
      case "most_expensive":
        return wines.sort((a, b) => getMinPrice(b) - getMinPrice(a));
      case "biggest_drop":
        return wines.sort(
          (a, b) => getPriceTrend(a).percentage - getPriceTrend(b).percentage
        );
    }
  }, [sortBy]);

  const allSources = Array.from(
    new Set(mockWines.flatMap((w) => w.prices.map((p) => p.sourceName)))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">価格比較</h1>
      <p className="text-muted-foreground mb-6">
        各ワインの最新価格を比較して最安値を見つけましょう
      </p>

      {/* Sort buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={sortBy === "cheapest" ? "default" : "outline"}
          onClick={() => setSortBy("cheapest")}
          size="sm"
        >
          安い順
        </Button>
        <Button
          variant={sortBy === "most_expensive" ? "default" : "outline"}
          onClick={() => setSortBy("most_expensive")}
          size="sm"
        >
          高い順
        </Button>
        <Button
          variant={sortBy === "biggest_drop" ? "default" : "outline"}
          onClick={() => setSortBy("biggest_drop")}
          size="sm"
        >
          値下がり率順
        </Button>
      </div>

      {/* Wine price cards */}
      <div className="space-y-4">
        {sortedWines.map((wine) => {
          const minPrice = getMinPrice(wine);
          const trend = getPriceTrend(wine);

          return (
            <Card key={wine.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Wine info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/wines/${wine.id}`}
                        className="font-semibold text-lg hover:underline truncate"
                      >
                        {wine.nameJa}
                      </Link>
                      <Badge className={wineTypeColors[wine.type]}>
                        {wineTypeLabels[wine.type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {wine.name}
                    </p>
                  </div>

                  {/* Price trend */}
                  <div className="flex items-center gap-2 text-sm shrink-0">
                    {trend.percentage > 0 ? (
                      <span className="text-red-600 font-medium">
                        ↑ +{trend.percentage}%
                      </span>
                    ) : trend.percentage < 0 ? (
                      <span className="text-green-600 font-medium">
                        ↓ {trend.percentage}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">→ 0%</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      (過去6ヶ月)
                    </span>
                  </div>

                  {/* Prices by source */}
                  <div className="flex flex-wrap gap-3 shrink-0">
                    {allSources.map((sourceName) => {
                      const priceEntry = wine.prices.find(
                        (p) => p.sourceName === sourceName
                      );
                      const isCheapest =
                        priceEntry && priceEntry.price === minPrice;

                      return (
                        <div key={sourceName} className="text-center min-w-[80px]">
                          <p className="text-xs text-muted-foreground mb-1">
                            {sourceName}
                          </p>
                          {priceEntry ? (
                            <p
                              className={`text-sm font-semibold ${
                                isCheapest
                                  ? "text-green-600"
                                  : "text-foreground"
                              }`}
                            >
                              {isCheapest && "★ "}
                              {formatPrice(priceEntry.price)}
                              {!priceEntry.inStock && (
                                <span className="block text-xs text-red-500">
                                  在庫なし
                                </span>
                              )}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">-</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
