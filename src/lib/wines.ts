import wineData from "./__generated__/wines.json";
import type { Wine, StoreCategory } from "@/types/wine";
import { supabase, isSupabaseConfigured } from "./supabase";

// ── 静的データ（JSONフォールバック） ──────────────────
const staticWines: Wine[] = wineData as Wine[];

// ── データ取得関数（Supabase優先、未設定ならJSON） ──────

/** DB行 → Wine型に変換 */
function dbRowToWine(row: Record<string, unknown>, stores: Record<string, unknown>[], buyLinks: Record<string, unknown>[]): Wine {
  return {
    id: row.id as string,
    name: row.name as string,
    nameJa: row.name_ja as string,
    producer: row.producer as string,
    country: row.country as string,
    countryCode: row.country_code as string,
    region: (row.region as string) ?? undefined,
    type: row.type as Wine["type"],
    grapeVarieties: row.grape_varieties as string[],
    description: row.description as string,
    price: row.price as number,
    abv: row.abv as number,
    servingTemp: row.serving_temp as string,
    pairings: row.pairings as string[],
    tags: row.tags as string[],
    whyBuyNow: row.why_buy_now as string,
    buzzScore: row.buzz_score as number,
    vivinoScore: row.vivino_score as number | null,
    costPerformance: row.cost_performance as number,
    tweetUrls: row.tweet_urls as string[],
    stores: stores.map((s) => ({
      type: s.store_type as string,
      name: s.store_name as string,
      price: s.price as number,
      inStock: s.in_stock as boolean,
    })) as Wine["stores"],
    buyLinks: buyLinks.map((b) => ({
      store: b.store as string,
      url: b.url as string,
      price: b.price as number,
    })),
  };
}

/** 全ワイン取得 */
export async function getWines(): Promise<Wine[]> {
  if (!isSupabaseConfigured || !supabase) return staticWines;

  const { data: wines, error } = await supabase
    .from("wines")
    .select("*")
    .eq("status", "published");

  if (error || !wines) return staticWines;

  const { data: allStores } = await supabase.from("wine_stores").select("*");
  const { data: allBuyLinks } = await supabase.from("buy_links").select("*");

  return wines.map((w) => dbRowToWine(
    w,
    (allStores ?? []).filter((s: Record<string, unknown>) => s.wine_id === w.id),
    (allBuyLinks ?? []).filter((b: Record<string, unknown>) => b.wine_id === w.id),
  ));
}

/** IDで1本取得 */
export async function getWineById(id: string): Promise<Wine | undefined> {
  if (!isSupabaseConfigured || !supabase) {
    return staticWines.find((w) => w.id === id);
  }

  const { data: wine, error } = await supabase
    .from("wines")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !wine) return staticWines.find((w) => w.id === id);

  const { data: stores } = await supabase.from("wine_stores").select("*").eq("wine_id", id);
  const { data: buyLinks } = await supabase.from("buy_links").select("*").eq("wine_id", id);

  return dbRowToWine(wine, stores ?? [], buyLinks ?? []);
}

// ── 同期アクセス（クライアントコンポーネント用、常にJSON） ──
export const wines: Wine[] = staticWines;

export function getWinesByType(type: string): Wine[] {
  return staticWines.filter((w) => w.type === type);
}

// ── 定数定義（UI用、DBに入れない） ──────────────────

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
  shinanoya: "信濃屋食品",
  // ネットショップ
  rakuten: "楽天",
  amazon: "Amazon",
  africaer: "アフリカー",
  ginza_grandmarche: "銀座グランマルシェ",
  takamura: "タカムラコーヒー",
  felicity: "フェリシティ",
  wine_ohashi: "ワインおおはし",
  ukiuki: "うきうきワイン",
  budouya: "葡萄屋",
  dragee: "ドラジェ",
  hasegawa: "リカーズハセガワ",
  kagadaya: "加賀屋",
  local_super: "近所のスーパー",
  mikuni_wine: "ミクニワイン",
  miraido: "未来堂",
  sa_wine_jp: "南アフリカワイン専門店",
  sankyushop: "三久ショップ",
  senmonten: "ワイン専門店",
  tuscany: "トスカニー",
  wine_grocery: "ワイングロッサリー",
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
      { type: "life", label: "ライフ" },
    ],
  },
  {
    category: "liquor",
    label: "酒屋",
    stores: [
      { type: "kaldi", label: "カルディ" },
      { type: "shinanoya", label: "信濃屋食品" },
      { type: "kakuyasu", label: "カクヤス" },
      { type: "yamaya", label: "ヤマヤ" },
      { type: "africaer", label: "アフリカー" },
      { type: "biccamera", label: "ビックカメラ" },
      { type: "liquorman", label: "リカマン" },
    ],
  },
  {
    category: "online",
    label: "ネットショップ",
    stores: [
      { type: "rakuten", label: "楽天" },
      { type: "amazon", label: "Amazon" },
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
