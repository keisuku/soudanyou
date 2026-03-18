/**
 * Vivino ワイン評価データ取得
 *
 * Vivinoは公式APIを提供していないため、
 * 以下のオプションで評価データを取得します:
 *
 * 1. Apify Vivino Scraper ($0.10-0.50/1000件)
 * 2. GitHub: vivino-api (非公式)
 * 3. 手動データ入力
 *
 * 本番環境ではApifyアクターの利用を推奨
 */

interface VivinoWineData {
  name: string;
  rating: number;
  ratingCount: number;
  region: string;
  country: string;
  wineType: string;
  grapes: string[];
  imageUrl: string;
}

export async function searchVivinoWine(
  wineName: string
): Promise<VivinoWineData | null> {
  const apifyToken = process.env.APIFY_API_TOKEN;

  if (!apifyToken) {
    console.warn(
      "APIFY_API_TOKEN が設定されていません。モックデータを使用します。"
    );
    return null;
  }

  // Apify Vivino Scraper Actor
  const actorId = "epctex/vivino-scraper";
  const url = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      search: wineName,
      maxItems: 1,
    }),
  });

  if (!res.ok) {
    console.error(`Vivino/Apify エラー: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return data?.data?.defaultDatasetId
    ? fetchApifyDataset(data.data.defaultDatasetId, apifyToken)
    : null;
}

async function fetchApifyDataset(
  datasetId: string,
  token: string
): Promise<VivinoWineData | null> {
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const items = await res.json();
  if (!items.length) return null;

  const item = items[0];
  return {
    name: item.name || "",
    rating: item.rating || 0,
    ratingCount: item.ratingCount || 0,
    region: item.region || "",
    country: item.country || "",
    wineType: item.wineType || "",
    grapes: item.grapes || [],
    imageUrl: item.imageUrl || "",
  };
}
