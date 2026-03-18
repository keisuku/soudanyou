"use client";

import { useState, useMemo } from "react";
import { mockWines } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import { SearchBar } from "@/components/search/search-bar";
import { WineFiltersPanel, type WineFilters } from "@/components/search/wine-filters";

interface Filters {
  types: string[];
  countries: string[];
  priceRange: [number, number] | null;
}

export default function WinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    types: [],
    countries: [],
    priceRange: null,
  });

  const filteredWines = useMemo(() => {
    return mockWines.filter((wine) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          wine.name.toLowerCase().includes(query) ||
          wine.nameJa.includes(query) ||
          wine.producer.toLowerCase().includes(query) ||
          wine.region.toLowerCase().includes(query) ||
          wine.grapeVarieties.some((g) => g.includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.types.length > 0 && !filters.types.includes(wine.type)) return false;
      if (filters.countries.length > 0 && !filters.countries.includes(wine.country)) return false;

      if (filters.priceRange) {
        const minPrice = wine.prices.length
          ? Math.min(...wine.prices.map((p) => p.price))
          : 0;
        if (minPrice < filters.priceRange[0] || minPrice > filters.priceRange[1]) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ワイン一覧</h1>

      <div className="mb-6">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="ワイン名、生産者、地域で検索..."
        />
      </div>

      <div className="mb-8">
        <WineFiltersPanel onFilterChange={setFilters} />
      </div>

      {filteredWines.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">検索条件に一致するワインが見つかりませんでした。</p>
          <p className="text-sm mt-2">検索条件を変更してお試しください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWines.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-6">
        {filteredWines.length} 件のワインが見つかりました
      </p>
    </div>
  );
}
