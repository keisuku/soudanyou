/**
 * Wine-Searcher API クライアント
 *
 * Wine-Searcherは公式APIを提供しています。
 * 批評家スコアの集約、価格比較データにアクセス可能。
 * https://www.wine-searcher.com/ws-api.lml
 *
 * 環境変数: WINE_SEARCHER_API_KEY
 */

interface WineSearcherResult {
  name: string;
  vintage: number;
  region: string;
  country: string;
  criticScore: number;
  averagePrice: number;
  currency: string;
  merchants: Array<{
    name: string;
    price: number;
    url: string;
  }>;
}

export async function searchWineSearcher(
  wineName: string
): Promise<WineSearcherResult | null> {
  const apiKey = process.env.WINE_SEARCHER_API_KEY;

  if (!apiKey) {
    console.warn(
      "WINE_SEARCHER_API_KEY が設定されていません。モックデータを使用します。"
    );
    return null;
  }

  const params = new URLSearchParams({
    Ession_key: apiKey,
    wine_name: wineName,
    country: "Japan",
    currency: "JPY",
  });

  const url = `https://api.wine-searcher.com/wine-select-api.lml?${params}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error(`Wine-Searcher API エラー: ${res.status}`);
    return null;
  }

  return res.json();
}
