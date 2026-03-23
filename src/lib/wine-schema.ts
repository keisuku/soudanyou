import { z } from "zod";

const storeTypes = [
  // コンビニ
  "seven", "lawson", "familymart",
  // スーパー
  "aeon", "summit", "ozeki", "seijoishii", "kaldi", "life",
  // 酒屋
  "kakuyasu", "yamaya", "biccamera", "liquorman",
  // ネットショップ
  "rakuten", "amazon", "africaer", "ginza_grandmarche", "takamura",
  "felicity", "wine_ohashi", "ukiuki",
  "wine_grocery", "sa_wine_jp", "miraido", "mikuni_wine",
  "budouya", "shinanoya", "tuscany", "hasegawa", "kagadaya", "dragee",
  "sankyushop", "senmonten", "local_super",
] as const;

const wineTypes = ["red", "white", "rose", "sparkling"] as const;

export const wineSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  nameJa: z.string().min(1),
  producer: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().length(2),
  region: z.string().optional(),
  type: z.enum(wineTypes),
  grapeVarieties: z.array(z.string()).min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stores: z.array(z.object({
    type: z.enum(storeTypes),
    name: z.string(),
    price: z.number().positive(),
    inStock: z.boolean(),
  })).min(1),
  buzzScore: z.number().min(0).max(100),
  vivinoScore: z.number().min(0).max(5).nullable(),
  costPerformance: z.number().min(0).max(100),
  tags: z.array(z.string()),
  tweetUrls: z.array(z.string()),
  abv: z.number().positive(),
  servingTemp: z.string(),
  pairings: z.array(z.string()),
  whyBuyNow: z.string().min(1),
  buyLinks: z.array(z.object({
    store: z.string(),
    url: z.string(),
    price: z.number().positive(),
  })),
});

export type WineData = z.infer<typeof wineSchema>;
