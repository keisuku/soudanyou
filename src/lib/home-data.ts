import { wines as allWines, storeLabels, countryCategories } from "./wines";
import type { Wine, WineType } from "@/types/wine";

export const countryJa = (country: string): string =>
  countryCategories.find((c) => c.country === country)?.label ?? country;

export const storeJa = (storeType: string): string =>
  storeLabels[storeType] ?? storeType;

export interface HomeWine {
  id: string;
  name: string;
  price: number;
  abv: number;
  type: WineType;
  catch: string;
  description: string;
  pairings: string[];
  storeLabels: string[];
  country: string;
  grape: string;
  vivino: number | null;
  cospa: number;
  buyUrl: string | null;
  raw: Wine;
}

export function toHomeWine(w: Wine): HomeWine {
  return {
    id: w.id,
    name: w.nameJa,
    price: w.price,
    abv: w.abv,
    type: w.type,
    catch: w.whyBuyNow,
    description: w.description,
    pairings: w.pairings,
    storeLabels: Array.from(new Set(w.stores.map((s) => storeJa(s.type)))),
    country: countryJa(w.country),
    grape: w.grapeVarieties.join("/"),
    vivino: w.vivinoScore,
    cospa: w.costPerformance,
    buyUrl: w.buyLinks[0]?.url ?? null,
    raw: w,
  };
}

export const homeWines: HomeWine[] = allWines.map(toHomeWine);

export const homeAllStores: string[] = Array.from(
  new Set(homeWines.flatMap((w) => w.storeLabels)),
).sort();

export const homeAllCountries: string[] = Array.from(
  new Set(homeWines.map((w) => w.country)),
).sort();

export const homeTypeMap: Record<WineType, { label: string; color: string; bg: string; icon: string }> = {
  red: { label: "赤", color: "#8B1A2B", bg: "#FDF2F4", icon: "🍷" },
  white: { label: "白", color: "#9B8A3E", bg: "#FEFDF2", icon: "🥂" },
  sparkling: { label: "泡", color: "#2E7D6B", bg: "#F0FAF7", icon: "🍾" },
  rose: { label: "ロゼ", color: "#C4627A", bg: "#FFF0F5", icon: "🌸" },
};

export const rakutenSearchUrl = (name: string): string =>
  `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(name)}/`;
