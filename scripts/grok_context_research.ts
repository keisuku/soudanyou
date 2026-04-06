#!/usr/bin/env npx tsx
/**
 * Grok Context Research — X検索専用レイヤー
 *
 * xAI API (Grok) の x_search ツールを使い、X (Twitter) のリアルタイム投稿を
 * 検索・要約して Context Pack を生成するスクリプト。
 *
 * Usage:
 *   npx tsx scripts/grok_context_research.ts --topic "AIトレンド" --locale ja
 *
 * Options:
 *   --topic     検索トピック (必須)
 *   --locale    ja | global  (default: ja)
 *   --audience  engineer | investor | both  (default: engineer)
 *   --days      直近N日以内の投稿に限定  (default: 30)
 *   --out-dir   出力先ディレクトリ  (default: data/context-research)
 *   --dry-run   API呼び出しせずプロンプトと利用状況のみ表示
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Config {
  apiKey: string;
  topic: string;
  locale: "ja" | "global";
  audience: "engineer" | "investor" | "both";
  days: number;
  outDir: string;
  dryRun: boolean;
  dailyLimitUsd: number;
  monthlyLimitUsd: number;
}

interface UsageEntry {
  timestamp: string;
  topic: string;
  estimatedCostUsd: number;
  inputTokens: number;
  outputTokens: number;
}

interface UsageLog {
  entries: UsageEntry[];
}

// ─── .env loader ─────────────────────────────────────────────────────────────

function loadDotenv(): void {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

// ─── CLI args parser ─────────────────────────────────────────────────────────

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = "true";
      }
    }
  }
  return args;
}

// ─── Config resolution ───────────────────────────────────────────────────────

function getConfig(): Config {
  loadDotenv();
  const args = parseArgs();

  const apiKey = args["api-key"] || process.env.XAI_API_KEY || "";
  if (!apiKey) {
    console.error("❌ XAI_API_KEY が設定されていません。.env ファイルまたは --api-key で指定してください。");
    process.exit(1);
  }

  const topic = args["topic"] || "";
  if (!topic) {
    console.error("❌ --topic は必須です。例: --topic \"AIトレンド 2024\"");
    process.exit(1);
  }

  return {
    apiKey,
    topic,
    locale: (args["locale"] as Config["locale"]) || "ja",
    audience: (args["audience"] as Config["audience"]) || "engineer",
    days: parseInt(args["days"] || "30", 10),
    outDir: args["out-dir"] || path.resolve(process.cwd(), "data/context-research"),
    dryRun: args["dry-run"] === "true",
    dailyLimitUsd: parseFloat(args["daily-limit"] || process.env.XAI_DAILY_LIMIT_USD || "1.00"),
    monthlyLimitUsd: parseFloat(args["monthly-limit"] || process.env.XAI_MONTHLY_LIMIT_USD || "10.00"),
  };
}

// ─── Cost tracking ───────────────────────────────────────────────────────────

const COST_PER_1K_INPUT_TOKENS = 0.003; // grok-4-1-fast-reasoning 概算
const COST_PER_1K_OUTPUT_TOKENS = 0.015;

function getUsageLogPath(outDir: string): string {
  return path.join(outDir, ".usage_log.json");
}

function loadUsageLog(outDir: string): UsageLog {
  const logPath = getUsageLogPath(outDir);
  if (!fs.existsSync(logPath)) return { entries: [] };
  try {
    return JSON.parse(fs.readFileSync(logPath, "utf-8"));
  } catch {
    return { entries: [] };
  }
}

function saveUsageLog(outDir: string, log: UsageLog): void {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(getUsageLogPath(outDir), JSON.stringify(log, null, 2), "utf-8");
}

function getTodayCost(log: UsageLog): number {
  const todayStr = new Date().toISOString().slice(0, 10);
  return log.entries
    .filter((e) => e.timestamp.startsWith(todayStr))
    .reduce((sum, e) => sum + e.estimatedCostUsd, 0);
}

function getMonthCost(log: UsageLog): number {
  const monthStr = new Date().toISOString().slice(0, 7);
  return log.entries
    .filter((e) => e.timestamp.startsWith(monthStr))
    .reduce((sum, e) => sum + e.estimatedCostUsd, 0);
}

function estimateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens / 1000) * COST_PER_1K_INPUT_TOKENS + (outputTokens / 1000) * COST_PER_1K_OUTPUT_TOKENS;
}

function checkBudget(config: Config): void {
  const log = loadUsageLog(config.outDir);
  const todayCost = getTodayCost(log);
  const monthCost = getMonthCost(log);

  console.log(`💰 本日の利用額: $${todayCost.toFixed(4)} / $${config.dailyLimitUsd.toFixed(2)}`);
  console.log(`💰 今月の利用額: $${monthCost.toFixed(4)} / $${config.monthlyLimitUsd.toFixed(2)}`);

  if (todayCost >= config.dailyLimitUsd) {
    console.error(`🚫 日次上限 ($${config.dailyLimitUsd.toFixed(2)}) に達しました。明日再試行してください。`);
    process.exit(1);
  }
  if (monthCost >= config.monthlyLimitUsd) {
    console.error(`🚫 月次上限 ($${config.monthlyLimitUsd.toFixed(2)}) に達しました。来月再試行してください。`);
    process.exit(1);
  }

  const remainingDaily = config.dailyLimitUsd - todayCost;
  const remainingMonthly = config.monthlyLimitUsd - monthCost;
  const estimatedCallCost = 0.10; // 1回の呼び出し概算
  if (estimatedCallCost > remainingDaily || estimatedCallCost > remainingMonthly) {
    console.warn(`⚠️  残り予算が少なくなっています (日次残: $${remainingDaily.toFixed(4)}, 月次残: $${remainingMonthly.toFixed(4)})`);
  }
}

function recordUsage(config: Config, inputTokens: number, outputTokens: number): void {
  const log = loadUsageLog(config.outDir);
  const cost = estimateCost(inputTokens, outputTokens);
  log.entries.push({
    timestamp: new Date().toISOString(),
    topic: config.topic,
    estimatedCostUsd: cost,
    inputTokens,
    outputTokens,
  });
  saveUsageLog(config.outDir, log);
  console.log(`📝 利用記録: $${cost.toFixed(4)} (入力: ${inputTokens} tokens, 出力: ${outputTokens} tokens)`);
}

// ─── Prompt builder ──────────────────────────────────────────────────────────

function buildPrompt(config: Config): string {
  const localeStrategy =
    config.locale === "ja"
      ? `検索は日本語と英語の両方で行い、日本語の情報を優先してください。
日本市場・日本語コミュニティの文脈を重視し、海外情報は補足として扱ってください。`
      : `Search in English primarily, supplementing with Japanese sources when relevant.
Focus on global trends and international perspectives.`;

  const audienceFrame =
    config.audience === "engineer"
      ? "技術者・エンジニア向けに、実装詳細・技術仕様・コード例を重視"
      : config.audience === "investor"
        ? "投資家・ビジネスパーソン向けに、市場規模・成長率・競合比較を重視"
        : "技術者と投資家の両方に有用な情報を、技術仕様と市場データの両面から収集";

  return `あなたはX (Twitter) のリアルタイム情報に特化したリサーチアシスタントです。

## 調査対象
「${config.topic}」について、直近${config.days}日以内のX投稿を中心にリサーチしてください。

## 検索戦略
${localeStrategy}

## 対象読者
${audienceFrame}

## 出力フォーマット
以下の構造でMarkdown形式のContext Packを作成してください:

### Topic
${config.topic} — 1文で要約

### Why Now（なぜ今このトピックが重要か）
- 3つの箇条書きで理由を述べる

### Key Questions（主要な論点 5-8個）
- 読者が知りたいであろう疑問をリストアップ

### Terminology / Definitions（用語定義）
- 専門用語とその定義、出典

### Primary Sources（一次情報）
- 公式発表、論文、GitHub、公式ドキュメントなど
- 各ソースにURLを付記

### X Posts（注目のX投稿）
- 話題になっている投稿、インフルエンサーの見解
- 投稿のURL、著者、要約を記載
- いいね数・リポスト数など反応指標があれば付記

### Contrasts / Counterpoints（反論・対立意見）
- 最低1つの反対意見とその根拠

### Data Points（数値データ）
- 日付付きの具体的数値（価格、利用者数、成長率など）

### Suggested Angles（記事の切り口 3案）

### Sources（URL一覧）
- 参照した全URLをリスト化

## 重要な制約
- 捏造した情報・数値を含めないこと
- 情報源が確認できないものは「未確認」と明記
- 投資助言は行わないこと
- 公式ソース > 実装例・GitHub > 信頼できる二次情報 の優先順位で情報を扱うこと
- すべての数値に「As of YYYY-MM-DD」を付記すること`;
}

// ─── API call ────────────────────────────────────────────────────────────────

async function postJson(url: string, body: unknown, apiKey: string, timeoutMs = 180_000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`xAI API error ${res.status}: ${errorBody}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ─── Response parsing ────────────────────────────────────────────────────────

function extractText(response: Record<string, unknown>): string {
  const output = response.output as Array<Record<string, unknown>> | undefined;
  if (!output) return JSON.stringify(response, null, 2);

  const texts: string[] = [];
  for (const item of output) {
    if (item.type === "message") {
      const content = item.content as Array<Record<string, unknown>> | undefined;
      if (content) {
        for (const block of content) {
          if (block.type === "text" && typeof block.text === "string") {
            texts.push(block.text);
          }
        }
      }
    }
  }
  return texts.join("\n\n") || JSON.stringify(response, null, 2);
}

function extractTokenUsage(response: Record<string, unknown>): { input: number; output: number } {
  const usage = response.usage as Record<string, number> | undefined;
  if (usage) {
    return {
      input: usage.input_tokens || usage.prompt_tokens || 0,
      output: usage.output_tokens || usage.completion_tokens || 0,
    };
  }
  // フォールバック: トークン数不明の場合、概算値を使用
  return { input: 2000, output: 4000 };
}

// ─── File output ─────────────────────────────────────────────────────────────

function timestampSlug(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "").replace("T", "_");
}

function saveFile(dir: string, filename: string, content: string): string {
  fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, content, "utf-8");
  return filepath;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const config = getConfig();
  const prompt = buildPrompt(config);

  console.log("━".repeat(60));
  console.log(`🔍 Grok X Research — "${config.topic}"`);
  console.log(`   locale: ${config.locale} | audience: ${config.audience} | days: ${config.days}`);
  console.log("━".repeat(60));

  // Budget check
  checkBudget(config);

  if (config.dryRun) {
    console.log("\n📋 [DRY RUN] プロンプト内容:\n");
    console.log(prompt);
    console.log("\n✅ dry-run 完了。API呼び出しは行われませんでした。");
    return;
  }

  // API request
  const requestBody = {
    model: "grok-4-1-fast-reasoning",
    tools: [{ type: "x_search" }],
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  console.log("\n⏳ xAI API を呼び出し中 (最大180秒)...\n");

  let response: Record<string, unknown>;
  try {
    response = (await postJson("https://api.x.ai/v1/responses", requestBody, config.apiKey)) as Record<string, unknown>;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("❌ タイムアウト: 180秒以内にレスポンスが返りませんでした。");
    } else {
      console.error("❌ API呼び出しエラー:", err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }

  // Extract text and token usage
  const text = extractText(response);
  const tokens = extractTokenUsage(response);
  const cost = estimateCost(tokens.input, tokens.output);

  // Record usage
  recordUsage(config, tokens.input, tokens.output);

  // Save output files
  const slug = timestampSlug();
  const localeTag = config.locale;

  const mdContent = `# Context Pack: ${config.topic}\n\n> Generated: ${new Date().toISOString()}\n> Locale: ${config.locale} | Audience: ${config.audience} | Days: ${config.days}\n> Estimated cost: $${cost.toFixed(4)}\n\n---\n\n${text}`;

  const jsonContent = JSON.stringify(
    {
      meta: {
        topic: config.topic,
        locale: config.locale,
        audience: config.audience,
        days: config.days,
        timestamp: new Date().toISOString(),
        estimatedCostUsd: cost,
        tokens,
      },
      request: requestBody,
      response,
    },
    null,
    2
  );

  const mdPath = saveFile(config.outDir, `${slug}_${localeTag}_context.md`, mdContent);
  const jsonPath = saveFile(config.outDir, `${slug}_${localeTag}_context.json`, jsonContent);
  const txtPath = saveFile(config.outDir, `${slug}_${localeTag}_context.txt`, text);

  console.log("━".repeat(60));
  console.log("✅ Context Pack 生成完了!");
  console.log(`   📄 Markdown: ${mdPath}`);
  console.log(`   📦 JSON:     ${jsonPath}`);
  console.log(`   📝 Text:     ${txtPath}`);
  console.log(`   💰 推定コスト: $${cost.toFixed(4)}`);
  console.log("━".repeat(60));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
