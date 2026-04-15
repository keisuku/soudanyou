import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { grokChat, extractJsonBlock, isGrokConfigured } from "@/lib/grok";

/**
 * POST /api/pipeline/extract
 *
 * tweet_sources の status='pending' レコードを Grok (xAI) で構造化抽出し、
 * extracted_data に格納して status='processed' / 'rejected' にする。
 *
 * body (optional): { limit?: number; dryRun?: boolean }
 *   - dryRun=true で DB 更新せず抽出結果のみ返す（プロンプト検証用）
 */

const EXTRACTION_SYSTEM_PROMPT = `あなたは日本在住のワイン愛好家向けメディアの編集アシスタントです。
X (旧Twitter) のポストから「ワインの購入情報」を構造化抽出します。
ワインに関係ないポストや、具体的なワイン名が特定できないポストは extracted=false を返してください。
出力は **必ず JSON 1 オブジェクトのみ**、余計な前置きや説明文は書かないこと。`;

const EXTRACTION_USER_TEMPLATE = (tweet: string) => `以下のXポストから情報を抽出し、次のJSONで返してください。

フィールド定義:
- extracted: boolean  (ワイン情報が抽出できた場合のみ true)
- confidence: 0〜1 の数値  (抽出の確信度)
- wine_name: 英字または現地表記のワイン名
- wine_name_ja: 日本語カタカナ表記
- producer: 生産者名
- country: 生産国 (日本語)
- type: "red" | "white" | "rose" | "sparkling"
- grape_varieties: 品種の配列 (日本語カタカナ)
- price: 数値 (円、不明なら null)
- store_name: 購入できる店舗名 (例: "セブンイレブン", "成城石井")
- pairings: 合う料理の配列 (日本語)
- why_buy_now: 1行キャッチコピー (30字以内)
- vivino_score: 0〜5 (記載があれば、なければ null)

ポスト本文:
"""
${tweet}
"""

JSON:`;

interface ExtractedWine {
  extracted: boolean;
  confidence?: number;
  wine_name?: string;
  wine_name_ja?: string;
  producer?: string;
  country?: string;
  type?: string;
  grape_varieties?: string[];
  price?: number | null;
  store_name?: string;
  pairings?: string[];
  why_buy_now?: string;
  vivino_score?: number | null;
}

export async function POST(request: Request) {
  try {
    if (!isGrokConfigured()) {
      return NextResponse.json(
        { error: "XAI_API_KEY is not configured." },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      limit?: number;
      dryRun?: boolean;
    };
    const limit = Math.min(Math.max(body.limit ?? 5, 1), 20);
    const dryRun = !!body.dryRun;

    const db = getServiceClient();
    const { data: pending, error } = await db
      .from("tweet_sources")
      .select("*")
      .eq("status", "pending")
      .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!pending || pending.length === 0) {
      return NextResponse.json({ message: "No pending tweets", processed: 0 });
    }

    const results: Array<{
      tweet_id: string;
      ok: boolean;
      extracted?: ExtractedWine;
      error?: string;
    }> = [];

    for (const tweet of pending) {
      const text = (tweet.text_content as string) ?? "";
      if (!text.trim()) {
        results.push({ tweet_id: tweet.tweet_id as string, ok: false, error: "empty text" });
        continue;
      }
      try {
        const resp = await grokChat({
          messages: [
            { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
            { role: "user", content: EXTRACTION_USER_TEMPLATE(text) },
          ],
          responseFormat: "json_object",
          temperature: 0.2,
          maxTokens: 800,
        });
        const parsed = extractJsonBlock(resp.content) as ExtractedWine;

        if (!dryRun) {
          await db
            .from("tweet_sources")
            .update({
              extracted_data: parsed,
              status: parsed.extracted ? "processed" : "rejected",
            })
            .eq("tweet_id", tweet.tweet_id);
        }

        results.push({
          tweet_id: tweet.tweet_id as string,
          ok: true,
          extracted: parsed,
        });
      } catch (e) {
        results.push({
          tweet_id: tweet.tweet_id as string,
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return NextResponse.json({
      message: `${results.filter((r) => r.ok).length}/${results.length} extracted`,
      dryRun,
      results,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}
