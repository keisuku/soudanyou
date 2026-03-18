/**
 * 楽天商品検索API クライアント
 *
 * 楽天APIアプリケーションIDが必要です（無料で取得可能）。
 * https://webservice.rakuten.co.jp/
 *
 * 環境変数: RAKUTEN_APP_ID
 */

interface RakutenItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  shopName: string;
  imageUrl: string;
  availability: number;
  reviewAverage: number;
  reviewCount: number;
}

interface RakutenSearchResponse {
  Items: Array<{ Item: RakutenItem }>;
  pageCount: number;
  count: number;
}

export async function searchRakutenWines(
  keyword: string,
  page: number = 1
): Promise<RakutenSearchResponse | null> {
  const appId = process.env.RAKUTEN_APP_ID;

  if (!appId) {
    console.warn(
      "RAKUTEN_APP_ID が設定されていません。モックデータを使用します。"
    );
    return null;
  }

  const params = new URLSearchParams({
    applicationId: appId,
    keyword: `ワイン ${keyword}`,
    genreId: "510915", // ワインジャンル
    hits: "30",
    page: String(page),
    sort: "-reviewAverage",
    format: "json",
  });

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`楽天API エラー: ${res.status}`);
    return null;
  }

  return res.json();
}
