"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { wines as allWines } from "@/lib/wines";
import { storeCategories, storeLabels } from "@/lib/wines";
import { WineCard } from "@/components/wine/wine-card";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import type { WineType } from "@/types/wine";
import { Suspense } from "react";

const typeFilters: { type: WineType; label: string }[] = [
  { type: "red", label: "🍷 赤" },
  { type: "white", label: "🥂 白" },
  { type: "sparkling", label: "🍾 泡" },
  { type: "rose", label: "🌸 ロゼ" },
];

const budgetFilters = [
  { label: "〜1,000円", max: 1000 },
  { label: "〜2,000円", max: 2000 },
  { label: "2,000円〜", max: 99999 },
];

const sortOptions = [
  { value: "cospa", label: "コスパ順" },
  { value: "buzz", label: "話題度順" },
  { value: "price-asc", label: "安い順" },
  { value: "vivino", label: "評価順" },
] as const;

type SortKey = (typeof sortOptions)[number]["value"];

function WinesContent() {
  const searchParams = useSearchParams();
  const storeParam = searchParams.get("store");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<WineType | null>(null);
  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("cospa");
  const [activeStore, setActiveStore] = useState<string | null>(storeParam);
  const [storeFilterOpen, setStoreFilterOpen] = useState(!!storeParam);

  // Sync with URL param
  useEffect(() => {
    setActiveStore(storeParam);
    if (storeParam) setStoreFilterOpen(true);
  }, [storeParam]);

  const filteredWines = useMemo(() => {
    let result = allWines.filter((wine) => {
      if (activeType && wine.type !== activeType) return false;
      if (activeBudget) {
        if (activeBudget === 99999) {
          if (wine.price <= 2000) return false;
        } else {
          const min = activeBudget === 1000 ? 0 : 1001;
          if (wine.price < min || wine.price > activeBudget) return false;
        }
      }
      if (activeStore) {
        if (!wine.stores.some((s) => s.type === activeStore)) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          wine.name.toLowerCase().includes(q) ||
          wine.nameJa.includes(q) ||
          wine.producer.toLowerCase().includes(q) ||
          wine.tags.some((t) => t.includes(q)) ||
          wine.pairings.some((p) => p.includes(q)) ||
          wine.grapeVarieties.some((g) => g.includes(q))
        );
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "buzz": return b.buzzScore - a.buzzScore;
        case "cospa": return b.costPerformance - a.costPerformance;
        case "price-asc": return a.price - b.price;
        case "vivino": return (b.vivinoScore ?? 0) - (a.vivinoScore ?? 0);
      }
    });

    return result;
  }, [searchQuery, activeType, activeBudget, sortBy, activeStore]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">
        {activeStore
          ? `${storeLabels[activeStore] ?? activeStore}のワイン`
          : `全${allWines.length}本のワイン`}
      </h1>

      <div className="mt-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="ワイン名、品種、料理名で検索..."
        />
      </div>

      {/* Filters */}
      <div className="mt-4 space-y-2">
        {/* Type */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">タイプ:</span>
          <Badge
            variant={activeType === null ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setActiveType(null)}
          >
            すべて
          </Badge>
          {typeFilters.map((f) => (
            <Badge
              key={f.type}
              variant={activeType === f.type ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setActiveType(activeType === f.type ? null : f.type)}
            >
              {f.label}
            </Badge>
          ))}
        </div>

        {/* Budget */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">予算:</span>
          <Badge
            variant={activeBudget === null ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setActiveBudget(null)}
          >
            すべて
          </Badge>
          {budgetFilters.map((b) => (
            <Badge
              key={b.max}
              variant={activeBudget === b.max ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setActiveBudget(activeBudget === b.max ? null : b.max)}
            >
              {b.label}
            </Badge>
          ))}
        </div>

        {/* Store filter */}
        <div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setStoreFilterOpen(!storeFilterOpen)}
          >
            <span className="mr-1">お店:</span>
            {activeStore ? (
              <Badge variant="default" className="text-xs">
                {storeLabels[activeStore] ?? activeStore}
                <span
                  className="ml-1 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setActiveStore(null); }}
                >
                  ×
                </span>
              </Badge>
            ) : (
              <Badge
                variant={storeFilterOpen ? "default" : "outline"}
                className="cursor-pointer text-xs"
              >
                {storeFilterOpen ? "閉じる" : "お店で絞る"}
              </Badge>
            )}
          </button>

          {storeFilterOpen && !activeStore && (
            <div className="mt-2 rounded-lg border border-border bg-card p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {storeCategories.map((cat) => (
                  <div key={cat.category}>
                    <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      {cat.label}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {cat.stores.map((store) => (
                        <Badge
                          key={store.type}
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setActiveStore(store.type)}
                        >
                          {store.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">並び:</span>
          {sortOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant={sortBy === opt.value ? "gold" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setSortBy(opt.value)}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredWines.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-lg">条件に合うワインが見つかりませんでした</p>
          <p className="mt-2 text-sm">フィルタを変更してお試しください</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWines.map((wine, i) => (
            <WineCard key={wine.id} wine={wine} rank={i + 1} />
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {filteredWines.length}/{allWines.length}件表示
      </p>
    </div>
  );
}

export default function WinesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-8">読み込み中...</div>}>
      <WinesContent />
    </Suspense>
  );
}
