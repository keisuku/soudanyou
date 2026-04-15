import { NextResponse } from "next/server";
import wineData from "@/lib/__generated__/wines.json";
import type { Wine } from "@/types/wine";
import { grokChat, isGrokConfigured, GrokError } from "@/lib/grok";

/**
 * POST /api/sommelier
 *
 * Grok を使ってユーザーの相談に答え、カタログ内の最適なワインを3本提案する。
 *
 * body: { question: string; budget?: number; type?: "red"|"white"|"rose"|"sparkling" }
 * returns: { answer: string; suggestions: Array<{ id: string; reason: string }> }
 */

const wines = wineData as unknown as Wine[];

const SYSTEM_PROMPT = `あなたは日本のコンビニ・スーパーで買えるワインに精通したソムリエです。
ユーザーの相談内容と、提示されるカタログの中から最も合うワインを **最大3本** 選び、選定理由を一文ずつ添えます。
口調は親しみやすい敬語で、絵文字は控えめに (最大1個/文)。
回答は **必ず** 以下のJSONのみ。前置き・後書き・マークダウン禁止。
{
  "answer": "全体コメント 2〜3文",
  "suggestions": [
    { "id": "カタログのid", "reason": "なぜこれを選んだか (40字程度)" }
  ]
}`;

interface Body {
  question?: string;
  budget?: number;
  type?: "red" | "white" | "rose" | "sparkling";
}

export async function POST(request: Request) {
  try {
    if (!isGrokConfigured()) {
      return NextResponse.json(
        { error: "AIソムリエは現在準備中です（XAI_API_KEY 未設定）" },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as Body;
    const question = (body.question ?? "").trim();
    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }
    if (question.length > 400) {
      return NextResponse.json({ error: "質問は400文字以内でお願いします" }, { status: 400 });
    }

    // カタログの軽量スナップショット（Grokに渡す）
    let candidates = wines;
    if (body.type) candidates = candidates.filter((w) => w.type === body.type);
    if (body.budget) candidates = candidates.filter((w) => w.price <= body.budget!);
    if (candidates.length === 0) candidates = wines;

    const catalog = candidates.slice(0, 40).map((w) => ({
      id: w.id,
      name: w.nameJa,
      type: w.type,
      price: w.price,
      country: w.country,
      grapes: w.grapeVarieties,
      pairings: w.pairings,
      why: w.whyBuyNow,
      vivino: w.vivinoScore,
    }));

    const userPrompt = `【ユーザーの相談】\n${question}\n\n【カタログ（JSON）】\n${JSON.stringify(catalog)}`;

    const resp = await grokChat({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      responseFormat: "json_object",
      temperature: 0.5,
      maxTokens: 700,
    });

    let parsed: { answer: string; suggestions: { id: string; reason: string }[] };
    try {
      parsed = JSON.parse(resp.content);
    } catch {
      const match = resp.content.match(/\{[\s\S]*\}/);
      if (!match) throw new GrokError("Grokから正しいJSONが返りませんでした");
      parsed = JSON.parse(match[0]);
    }

    // id の存在確認＋フル情報をアタッチ
    const enriched = (parsed.suggestions ?? [])
      .map((s) => {
        const wine = wines.find((w) => w.id === s.id);
        return wine ? { ...s, wine } : null;
      })
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({
      answer: parsed.answer ?? "",
      suggestions: enriched,
      model: resp.model,
    });
  } catch (e) {
    const status = e instanceof GrokError && e.status ? e.status : 500;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status },
    );
  }
}
