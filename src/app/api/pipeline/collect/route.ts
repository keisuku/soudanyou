import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

/**
 * POST /api/pipeline/collect
 *
 * Xからワイン関連ツイートを収集し、tweet_sourcesテーブルに保存する。
 *
 * 現時点ではスケルトン。以下のいずれかで実装予定:
 * - X API v2 (Basic $100/月)
 * - Apify Twitter Scraper ($5〜/月)
 * - 手動投入（requestBodyにツイートURL配列を渡す）
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as { tweetUrls?: string[] };

    // 手動投入モード: URLリストを渡す
    if (body.tweetUrls && body.tweetUrls.length > 0) {
      const db = getServiceClient();

      const records = body.tweetUrls.map((url: string) => {
        const tweetId = url.split("/status/")[1]?.split("?")[0] ?? "";
        return {
          tweet_id: tweetId,
          tweet_url: url,
          text_content: "", // 後でextractで埋める
          status: "pending",
        };
      });

      const { data, error } = await db
        .from("tweet_sources")
        .upsert(records, { onConflict: "tweet_id" })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        message: `${data?.length ?? 0} tweets collected`,
        data,
      });
    }

    // TODO: X API自動収集モード
    return NextResponse.json({
      message: "Auto-collect not yet implemented. Pass { tweetUrls: [...] } for manual mode.",
    });

  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
