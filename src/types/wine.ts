export type WineType = "red" | "white" | "rose" | "sparkling";

export type StoreType =
  | "seven"
  | "lawson"
  | "familymart"
  | "aeon"
  | "seijoishii"
  | "kaldi"
  | "donki"
  | "costco"
  | "rakuten"
  | "amazon"
  | "liquor_shop";

export interface Store {
  type: StoreType;
  name: string;
  price: number;
  inStock: boolean;
}

export interface Wine {
  id: string;
  name: string;
  nameJa: string;
  producer: string;
  country: string;
  countryCode: string;
  type: WineType;
  grapeVarieties: string[];
  description: string;
  /** 価格（税込・代表価格） */
  price: number;
  /** 購入できる店舗 */
  stores: Store[];
  /** SNS話題度スコア (0-100) */
  buzzScore: number;
  /** Vivinoスコア (0-5) */
  vivinoScore: number | null;
  /** コスパ指標 (0-100): 評価÷価格の正規化値 */
  costPerformance: number;
  /** おすすめタグ（シーン・用途） */
  tags: string[];
  /** 関連SNS投稿 */
  posts: SnsPost[];
}

export interface SnsPost {
  id: string;
  platform: "x" | "instagram";
  authorName: string;
  authorHandle: string;
  content: string;
  likes: number;
  postedAt: string;
}
