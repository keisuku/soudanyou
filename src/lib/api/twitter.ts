/**
 * X (Twitter) ワイン情報収集
 *
 * X APIの無料枠は非常に制限的（月1500ツイート読み取り）のため、
 * サードパーティサービスの利用を推奨:
 *
 * 1. Apify Twitter Scraper
 * 2. SocialData.tools API
 * 3. Bright Data
 *
 * 環境変数: APIFY_API_TOKEN または TWITTER_BEARER_TOKEN
 */

import type { Tweet } from "@/types/wine";

const WINE_HASHTAGS = [
  "#ワイン",
  "#日本ワイン",
  "#ナチュラルワイン",
  "#ソムリエ",
  "#ワイン好き",
  "#ボルドー",
  "#ブルゴーニュ",
  "#シャンパン",
];

export async function fetchWineTweets(): Promise<Tweet[]> {
  const apifyToken = process.env.APIFY_API_TOKEN;

  if (!apifyToken) {
    console.warn(
      "APIFY_API_TOKEN が設定されていません。モックデータを使用します。"
    );
    return [];
  }

  const actorId = "apidojo/tweet-scraper";
  const url = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchTerms: WINE_HASHTAGS,
      maxTweets: 50,
      sort: "Latest",
    }),
  });

  if (!res.ok) {
    console.error(`Twitter/Apify エラー: ${res.status}`);
    return [];
  }

  const run = await res.json();
  if (!run?.data?.defaultDatasetId) return [];

  const datasetUrl = `https://api.apify.com/v2/datasets/${run.data.defaultDatasetId}/items?token=${apifyToken}`;
  const dataRes = await fetch(datasetUrl);
  if (!dataRes.ok) return [];

  const items = await dataRes.json();
  return items.map(
    (item: Record<string, unknown>): Tweet => ({
      id: String(item.id || ""),
      authorName: String(item.author_name || ""),
      authorHandle: String(item.author_handle || ""),
      authorAvatar: String(item.author_avatar || ""),
      content: String(item.text || ""),
      createdAt: String(item.created_at || ""),
      likes: Number(item.likes || 0),
      retweets: Number(item.retweets || 0),
      wineRelated: extractWineKeywords(String(item.text || "")),
    })
  );
}

function extractWineKeywords(text: string): string[] {
  const keywords = [
    "ボルドー", "ブルゴーニュ", "シャンパーニュ", "シャンパン",
    "ナパバレー", "トスカーナ", "ピエモンテ", "リオハ",
    "甲州", "日本ワイン", "ナチュラルワイン",
    "カベルネ", "メルロー", "ピノ・ノワール", "シャルドネ",
    "ソーヴィニヨン", "シラーズ", "テンプラニーリョ",
    "ロゼ", "スパークリング", "赤ワイン", "白ワイン",
    "オーパスワン", "ドン・ペリニヨン", "マルゴー",
    "サッシカイア", "ペンフォールズ",
  ];

  return keywords.filter((kw) => text.includes(kw));
}
