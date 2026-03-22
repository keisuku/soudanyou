import wineData from "./__generated__/wines.json";
import type { Wine } from "@/types/wine";

export const wines: Wine[] = wineData as Wine[];

export function getWineById(id: string): Wine | undefined {
  return wines.find((w) => w.id === id);
}

export function getWinesByType(type: string): Wine[] {
  return wines.filter((w) => w.type === type);
}

import type { StoreCategory } from "@/types/wine";

export const storeLabels: Record<string, string> = {
  // コンビニ
  seven: "セブン",
  lawson: "ローソン",
  familymart: "ファミマ",
  // スーパー
  aeon: "イオン",
  summit: "サミット",
  ozeki: "オオゼキ",
  seijoishii: "成城石井",
  kaldi: "カルディ",
  life: "ライフ",
  // 酒屋
  kakuyasu: "カクヤス",
  yamaya: "ヤマヤ",
  biccamera: "ビックカメラ",
  liquorman: "リカマン",
  // ネットショップ
  rakuten: "楽天",
  africaer: "アフリカー",
  ginza_grandmarche: "銀座グランマルシェ",
  takamura: "タカムラコーヒー",
  felicity: "フェリシティ",
  wine_ohashi: "ワインおおはし",
  ukiuki: "うきうきワイン",
};

export const storeCategoryLabels: Record<StoreCategory, string> = {
  convenience: "コンビニ",
  supermarket: "スーパー",
  liquor: "酒屋",
  online: "ネットショップ",
};

export interface StoreCategoryDef {
  category: StoreCategory;
  label: string;
  stores: { type: string; label: string }[];
}

export const storeCategories: StoreCategoryDef[] = [
  {
    category: "convenience",
    label: "コンビニ",
    stores: [
      { type: "seven", label: "セブン" },
      { type: "lawson", label: "ローソン" },
      { type: "familymart", label: "ファミマ" },
    ],
  },
  {
    category: "supermarket",
    label: "スーパー",
    stores: [
      { type: "aeon", label: "イオン" },
      { type: "summit", label: "サミット" },
      { type: "ozeki", label: "オオゼキ" },
      { type: "seijoishii", label: "成城石井" },
      { type: "kaldi", label: "カルディ" },
      { type: "life", label: "ライフ" },
    ],
  },
  {
    category: "liquor",
    label: "酒屋",
    stores: [
      { type: "kakuyasu", label: "カクヤス" },
      { type: "yamaya", label: "ヤマヤ" },
      { type: "biccamera", label: "ビックカメラ" },
      { type: "liquorman", label: "リカマン" },
    ],
  },
  {
    category: "online",
    label: "ネットショップ",
    stores: [
      { type: "rakuten", label: "楽天" },
      { type: "africaer", label: "アフリカー" },
      { type: "ginza_grandmarche", label: "銀座グランマルシェ" },
      { type: "takamura", label: "タカムラコーヒー" },
      { type: "felicity", label: "フェリシティ" },
      { type: "wine_ohashi", label: "ワインおおはし" },
      { type: "ukiuki", label: "うきうきワイン" },
    ],
  },
];

export interface CountrySubRegion {
  key: string;
  label: string;
}

export interface CountryCategoryDef {
  country: string;
  label: string;
  subRegions?: CountrySubRegion[];
}

export const countryCategories: CountryCategoryDef[] = [
  {
    country: "France",
    label: "フランス",
    subRegions: [
      { key: "ブルゴーニュ", label: "ブルゴーニュ" },
      { key: "シャンパーニュ", label: "シャンパーニュ" },
      { key: "ボルドー", label: "ボルドー" },
      { key: "その他", label: "その他" },
    ],
  },
  { country: "Italy", label: "イタリア" },
  { country: "Spain", label: "スペイン" },
  { country: "Chile", label: "チリ" },
  { country: "South Africa", label: "南アフリカ" },
  { country: "Australia", label: "オーストラリア" },
  { country: "Germany", label: "ドイツ" },
  { country: "Japan", label: "日本" },
];
