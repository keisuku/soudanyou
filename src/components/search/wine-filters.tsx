"use client";

import { useState, useCallback } from "react";
import type { WineType } from "@/types/wine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WineFilters {
  types: WineType[];
  countries: string[];
  priceRange: [number, number] | null;
}

interface WineFiltersProps {
  onFilterChange: (filters: WineFilters) => void;
}

const wineTypes: { value: WineType; label: string }[] = [
  { value: "red", label: "赤" },
  { value: "white", label: "白" },
  { value: "rose", label: "ロゼ" },
  { value: "sparkling", label: "スパークリング" },
];

const countries = [
  "France",
  "Italy",
  "USA",
  "Japan",
  "Australia",
  "Spain",
  "New Zealand",
];

const priceRanges: { label: string; range: [number, number] }[] = [
  { label: "~3,000円", range: [0, 3000] },
  { label: "3,000~10,000円", range: [3000, 10000] },
  { label: "10,000~50,000円", range: [10000, 50000] },
  { label: "50,000円~", range: [50000, Infinity] },
];

export function WineFiltersPanel({ onFilterChange }: WineFiltersProps) {
  const [filters, setFilters] = useState<WineFilters>({
    types: [],
    countries: [],
    priceRange: null,
  });

  const update = useCallback(
    (next: WineFilters) => {
      setFilters(next);
      onFilterChange(next);
    },
    [onFilterChange]
  );

  const toggleType = (type: WineType) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    update({ ...filters, types });
  };

  const toggleCountry = (country: string) => {
    const countries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    update({ ...filters, countries });
  };

  const selectPriceRange = (range: [number, number]) => {
    const same =
      filters.priceRange &&
      filters.priceRange[0] === range[0] &&
      filters.priceRange[1] === range[1];
    update({ ...filters, priceRange: same ? null : range });
  };

  return (
    <div className="space-y-4">
      {/* Wine type */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">タイプ</h4>
        <div className="flex flex-wrap gap-2">
          {wineTypes.map(({ value, label }) => (
            <Button
              key={value}
              variant={filters.types.includes(value) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Country */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">産地</h4>
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <Button
              key={country}
              variant={filters.countries.includes(country) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleCountry(country)}
            >
              {country}
            </Button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">価格帯</h4>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map(({ label, range }) => {
            const active =
              filters.priceRange &&
              filters.priceRange[0] === range[0] &&
              filters.priceRange[1] === range[1];
            return (
              <Button
                key={label}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => selectPriceRange(range)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
