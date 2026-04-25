export type WineType = "red" | "white" | "rose" | "sparkling";

export type StoreType =
  // コンビニ
  | "seven"
  | "lawson"
  | "familymart"
  // スーパー
  | "aeon"
  | "summit"
  | "ozeki"
  | "seijoishii"
  | "kaldi"
  | "life"
  // 酒屋
  | "kakuyasu"
  | "yamaya"
  | "biccamera"
  | "liquorman"
  | "shinanoya"
  // ネットショップ
  | "rakuten"
  | "amazon"
  | "africaer"
  | "ginza_grandmarche"
  | "takamura"
  | "felicity"
  | "wine_ohashi"
  | "ukiuki"
  | "budouya"
  | "dragee"
  | "hasegawa"
  | "kagadaya"
  | "local_super"
  | "mikuni_wine"
  | "miraido"
  | "sa_wine_jp"
  | "sankyushop"
  | "senmonten"
  | "tuscany"
  | "wine_grocery";

export type StoreCategory = "convenience" | "supermarket" | "liquor" | "online";

export interface Store {
  type: StoreType;
  name: string;
  price: number;
  inStock: boolean;
}

export interface BuyLink {
  store: string;
  url: string;
  price: number;
}

export interface Wine {
  id: string;
  name: string;
  nameJa: string;
  producer: string;
  country: string;
  countryCode: string;
  region?: string;
  type: WineType;
  grapeVarieties: string[];
  description: string;
  price: number;
  stores: Store[];
  buzzScore: number;
  vivinoScore: number | null;
  costPerformance: number;
  tags: string[];
  tweetUrls: string[];
  /** アルコール度数 */
  abv: number;
  /** 飲み頃温度 */
  servingTemp: string;
  /** 合う料理 */
  pairings: string[];
  /** 今買うべき理由（1行キャッチ） */
  whyBuyNow: string;
  /** 購入リンク */
  buyLinks: BuyLink[];
}
