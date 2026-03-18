export type WineType = "red" | "white" | "rose" | "sparkling" | "dessert";

export interface Wine {
  id: string;
  name: string;
  nameJa: string;
  producer: string;
  region: string;
  country: string;
  countryCode: string;
  vintage: number | null;
  type: WineType;
  grapeVarieties: string[];
  imageUrl: string;
  description: string;
  ratings: WineRatings;
  prices: WinePrice[];
  priceHistory: PricePoint[];
}

export interface WineRatings {
  vivino: number | null;
  vivinoCount: number | null;
  wineSearcher: number | null;
  cellarTracker: number | null;
}

export interface WinePrice {
  source: "rakuten" | "amazon" | "wine_searcher" | "enoteca" | "other";
  sourceName: string;
  price: number;
  url: string;
  lastUpdated: string;
  inStock: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
  source: string;
}

export interface WineRegion {
  slug: string;
  name: string;
  nameJa: string;
  country: string;
  countryCode: string;
  description: string;
  wineCount: number;
  coordinates: [number, number];
  bounds?: [[number, number], [number, number]];
}

export interface Tweet {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  retweets: number;
  wineRelated: string[];
}

export interface TrendItem {
  keyword: string;
  count: number;
  change: number;
  wines: string[];
}
