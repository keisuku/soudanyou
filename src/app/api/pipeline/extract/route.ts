import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

/**
 * POST /api/pipeline/extract
 *
 * tweet_sourcesのpendingレコードをAI（Claude API）で構造化抽出し、
 * wines候補（draft状態）を自動生成する。
 *
 * 現時点ではスケルトン。Claude APIキー設定後に実装予定。
 *
 * 処理フロー:
 *   1. tweet_sources で status='pending' のレコードを取得
 *   2. 各ツイートテキストをClaude APIに送信
 *   3. 抽出結果: { wine_name, producer, country, type, price, store, ... }
 *   4. extracted_data に保存し、status='processed' に変更
 *   5. 新しいワインなら wines テーブルに draft で INSERT
 *   6. 既存ワインなら tweet_urls に追加 & buzz_score 再計算
 */
export async function POST() {
  try {
    const db = getServiceClient();

    // pending なツイートを取得
    const { data: pending, error } = await db
      .from("tweet_sources")
      .select("*")
      .eq("status", "pending")
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pending || pending.length === 0) {
      return NextResponse.json({ message: "No pending tweets to process" });
    }

    // TODO: Claude API で各ツイートから情報を抽出
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    //
    // for (const tweet of pending) {
    //   const response = await anthropic.messages.create({
    //     model: "claude-sonnet-4-20250514",
    //     max_tokens: 1024,
    //     messages: [{
    //       role: "user",
    //       content: `以下のツイートからワイン情報を抽出してJSONで返してください。
    //         ツイート: ${tweet.text_content}
    //         フォーマット: { wine_name, wine_name_ja, producer, country, type, price, store_type, ... }`
    //     }],
    //   });
    //   // → extracted_data に保存 → wines テーブルに draft INSERT
    // }

    return NextResponse.json({
      message: `${pending.length} pending tweets found. AI extraction not yet implemented.`,
      pendingCount: pending.length,
      tweets: pending.map((t: Record<string, unknown>) => ({
        id: t.id,
        tweet_url: t.tweet_url,
        status: t.status,
      })),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
