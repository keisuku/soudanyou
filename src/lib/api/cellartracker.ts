/**
 * CellarTracker コミュニティレビューデータ
 *
 * CellarTrackerは公式APIを提供していません。
 * コミュニティスコアの取得にはスクレイピングが必要です。
 *
 * 注意: スクレイピングはCellarTrackerの利用規約を確認の上で実施してください。
 * 代替として手動データ入力やコミュニティデータの利用を推奨。
 */

interface CellarTrackerScore {
  wineName: string;
  communityScore: number;
  reviewCount: number;
  communityNotes: string[];
}

export async function getCellarTrackerScore(
  wineName: string
): Promise<CellarTrackerScore | null> {
  // CellarTrackerはAPIを提供していないため、
  // 本番環境ではスクレイピングまたは手動データ管理が必要
  console.warn(
    "CellarTracker: 公式APIなし。モックデータを使用します。"
  );
  return null;
}
