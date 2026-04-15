/**
 * xAI Grok クライアント（OpenAI互換）
 *
 * 必要な環境変数:
 *   XAI_API_KEY       — xAI コンソールで発行する API キー
 *   XAI_MODEL         — 任意。既定は "grok-2-1212"（安定版）
 *   XAI_BASE_URL      — 任意。既定は "https://api.x.ai/v1"
 */

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GrokChatOptions {
  messages: GrokMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** JSONモード（content を必ず単一JSON文字列として返す） */
  responseFormat?: "json_object" | "text";
}

export interface GrokChatResponse {
  content: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  model: string;
}

export class GrokError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "GrokError";
  }
}

export function isGrokConfigured(): boolean {
  return !!process.env.XAI_API_KEY;
}

export async function grokChat(opts: GrokChatOptions): Promise<GrokChatResponse> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new GrokError("XAI_API_KEY is not configured");

  const baseUrl = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";
  const model = opts.model ?? process.env.XAI_MODEL ?? "grok-2-1212";

  const body: Record<string, unknown> = {
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    max_tokens: opts.maxTokens ?? 1024,
  };
  if (opts.responseFormat === "json_object") {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GrokError(
      `Grok API ${res.status}: ${text.slice(0, 300)}`,
      res.status,
    );
  }

  const json = await res.json() as {
    choices: { message: { content: string } }[];
    usage?: GrokChatResponse["usage"];
    model?: string;
  };

  return {
    content: json.choices[0]?.message?.content ?? "",
    usage: json.usage,
    model: json.model ?? model,
  };
}

/** Grok応答から最初のJSONオブジェクトを抽出（response_format非対応モデル保険） */
export function extractJsonBlock(text: string): unknown {
  const trimmed = text.trim();
  // 素のJSON
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try { return JSON.parse(trimmed); } catch {}
  }
  // ```json ... ``` ブロック
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]+?)```/);
  if (fence) {
    try { return JSON.parse(fence[1]); } catch {}
  }
  // 最初の { ... } を拾う
  const brace = trimmed.match(/\{[\s\S]*\}/);
  if (brace) {
    try { return JSON.parse(brace[0]); } catch {}
  }
  throw new GrokError("Grok応答からJSONを抽出できませんでした");
}
