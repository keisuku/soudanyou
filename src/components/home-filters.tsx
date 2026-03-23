"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { storeCategories, countryCategories } from "@/lib/wines";
import type { WineType } from "@/types/wine";

const typeFilters: { type: WineType; label: string }[] = [
  { type: "red", label: "🍷 赤" },
  { type: "white", label: "🥂 白" },
  { type: "sparkling", label: "🍾 泡" },
  { type: "rose", label: "🌸 ロゼ" },
];

const budgetFilters = [
  { label: "〜2,000円", max: 2000 },
  { label: "2,000円〜", max: 99999 },
];

const sortOptions = [
  { value: "cospa", label: "コスパ順" },
  { value: "buzz", label: "話題度順" },
  { value: "price-asc", label: "安い順" },
  { value: "vivino", label: "評価順" },
];

export function HomeFilters() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<WineType | null>(null);
  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const [storeOpen, setStoreOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [sortBy, setSortBy] = useState("cospa");

  function navigate() {
    const params = new URLSearchParams();
    if (activeType) params.set("type", activeType);
    if (activeBudget) params.set("budget", String(activeBudget));
    if (activeStore) params.set("store", activeStore);
    if (sortBy !== "cospa") params.set("sort", sortBy);
    if (query) params.set("q", query);
    const qs = params.toString();
    router.push(`/wines${qs ? `?${qs}` : ""}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate();
  }

  function goWithStore(store: string) {
    router.push(`/wines?store=${store}`);
  }

  function goWithCountry(country: string, region?: string) {
    const params = new URLSearchParams({ country });
    if (region) params.set("region", region);
    router.push(`/wines?${params.toString()}`);
  }

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ワイン名、品種、料理名で検索..."
          className="pl-10"
        />
      </form>

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

      {/* Store */}
      <div>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setStoreOpen(!storeOpen)}
        >
          <span className="mr-1">お店:</span>
          {activeStore ? (
            <Badge variant="default" className="text-xs">
              {activeStore}
              <span
                className="ml-1 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setActiveStore(null); }}
              >
                ×
              </span>
            </Badge>
          ) : (
            <Badge variant={storeOpen ? "default" : "outline"} className="cursor-pointer text-xs">
              {storeOpen ? "閉じる" : "お店で絞る"}
            </Badge>
          )}
        </button>
        {storeOpen && !activeStore && (
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
                        onClick={() => goWithStore(store.type)}
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

      {/* Country */}
      <div>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setCountryOpen(!countryOpen)}
        >
          <span className="mr-1">国:</span>
          <Badge variant={countryOpen ? "default" : "outline"} className="cursor-pointer text-xs">
            {countryOpen ? "閉じる" : "国で絞る"}
          </Badge>
        </button>
        {countryOpen && (
          <div className="mt-2 rounded-lg border border-border bg-card p-3">
            <div className="space-y-3">
              {countryCategories.map((cat) => (
                <div key={cat.country}>
                  {cat.subRegions ? (
                    <>
                      <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                        {cat.label}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-primary hover:text-primary-foreground"
                          onClick={() => goWithCountry(cat.country)}
                        >
                          すべて
                        </Badge>
                        {cat.subRegions.map((r) => (
                          <Badge
                            key={r.key}
                            variant="outline"
                            className="cursor-pointer text-xs hover:bg-primary hover:text-primary-foreground"
                            onClick={() => goWithCountry(cat.country, r.key)}
                          >
                            {r.label}
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Badge
                      variant="outline"
                      className="cursor-pointer text-xs hover:bg-primary hover:text-primary-foreground"
                      onClick={() => goWithCountry(cat.country)}
                    >
                      {cat.label}
                    </Badge>
                  )}
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
  );
}
