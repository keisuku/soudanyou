import { readFileSync } from "fs";
import { join } from "path";

interface Wine {
  id: string;
  name: string;
  nameJa: string;
  producer: string;
  country: string;
  countryCode: string;
  region?: string;
  type: string;
  grapeVarieties: string[];
  description: string;
  price: number;
  stores: { type: string; name: string; price: number; inStock: boolean }[];
  buzzScore: number;
  vivinoScore: number | null;
  costPerformance: number;
  tags: string[];
  tweetUrls: string[];
  abv: number;
  servingTemp: string;
  pairings: string[];
  whyBuyNow: string;
  buyLinks: { store: string; url: string; price: number }[];
}

const winesPath = join(
  __dirname,
  "../src/lib/__generated__/wines.json"
);
const wines: Wine[] = JSON.parse(readFileSync(winesPath, "utf-8"));

const typeLabel: Record<string, string> = {
  red: "赤",
  white: "白",
  rose: "ロゼ",
  sparkling: "スパークリング",
};

const headers = [
  "名前(日本語)",
  "名前(英語)",
  "生産者",
  "国",
  "地域",
  "タイプ",
  "品種",
  "価格(税込)",
  "Buzzスコア",
  "Vivinoスコア",
  "コスパ",
  "ABV(%)",
  "飲み頃温度",
  "合う料理",
  "タグ",
  "販売店(店名:価格)",
  "今買うべき理由",
  "説明",
];

console.log(headers.join("\t"));

for (const w of wines) {
  const stores = w.stores
    .map((s) => `${s.name}:¥${s.price}`)
    .join(", ");

  const row = [
    w.nameJa,
    w.name,
    w.producer,
    w.country,
    w.region ?? "",
    typeLabel[w.type] ?? w.type,
    w.grapeVarieties.join(", "),
    w.price,
    w.buzzScore,
    w.vivinoScore ?? "",
    w.costPerformance,
    w.abv,
    w.servingTemp,
    w.pairings.join(", "),
    w.tags.join(", "),
    stores,
    w.whyBuyNow.replace(/\n/g, " "),
    w.description.replace(/\n/g, " ").trim(),
  ];

  console.log(row.join("\t"));
}

console.error(`\n✅ ${wines.length}件のワインを出力しました`);
