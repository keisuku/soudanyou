"use client";

import { useState, useMemo } from "react";
import { mockWines } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import type { WineType } from "@/types/wine";

const typeFilters: { type: WineType; label: string }[] = [
  { type: "red", label: "赤" },
  { type: "white", label: "白" },
  { type: "sparkling", label: "泡" },
  { type: "rose", label: "ロゼ" },
];

const sortOptions = [
  { value: "buzz", label: "話題度順" },
  { value: "cospa", label: "コスパ順" },
  { value: "price-asc", label: "安い順" },
  { value: "price-desc", label: "高い順" },
] as const;

type SortKey = (typeof sortOptions)[number]["value"];

export default function WinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<WineType | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("buzz");

  const filteredWines = useMemo(() => {
    let result = mockWines.filter((wine) => {
      if (activeType && wine.type !== activeType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          wine.name.toLowerCase().includes(q) ||
          wine.nameJa.includes(q) ||
          wine.producer.toLowerCase().includes(q) ||
          wine.tags.some((t) => t.includes(q)) ||
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
        case "price-desc": return b.price - a.price;
      }
    });

    return result;
  }, [searchQuery, activeType, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">ワイン一覧</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        全{mockWines.length}本から探す
      </p>

      <div className="mt-6">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="ワイン名、品種、タグで検索..."
        />
      </div>

      {/* Type filters + sort */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge
          variant={activeType === null ? "gold" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveType(null)}
        >
          すべて
        </Badge>
        {typeFilters.map((f) => (
          <Badge
            key={f.type}
            variant={activeType === f.type ? "gold" : "secondary"}
            className="cursor-pointer"
            onClick={() => setActiveType(activeType === f.type ? null : f.type)}
          >
            {f.label}
          </Badge>
        ))}
        <span className="mx-2 text-muted-foreground">|</span>
        {sortOptions.map((opt) => (
          <Badge
            key={opt.value}
            variant={sortBy === opt.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSortBy(opt.value)}
          >
            {opt.label}
          </Badge>
        ))}
      </div>

      {filteredWines.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-lg">条件に合うワインが見つかりませんでした</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWines.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        {filteredWines.length}件表示
      </p>
    </div>
  );
}
