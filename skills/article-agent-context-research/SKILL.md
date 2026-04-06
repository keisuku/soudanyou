---
name: article-agent-context-research
description: 記事執筆の前工程として、Grok (xAI API) の x_search を活用し、X (Twitter) のリアルタイム投稿を中心に周辺情報を検索・収集して Context Pack を作る。
---

# Article Agent Context Research (X検索リサーチ)

## Overview
Grok (xAI API) をX検索専用レイヤーとして活用し、任意のトピックについてX投稿のリアルタイム情報を収集・要約する。Claude CodeやChatGPTが苦手とするXのリアルタイム検索を、Grokの `x_search` 機能で補完する。

## Defaults
- **プラットフォーム**: X (Twitter) 固定
- **対象読者**: エンジニア / 投資家
- **ドメイン**: AI / Web3 / テック全般
- **トーン**: フォーマル、結論先出し
- **コスト上限**: 日次 $1.00 / 月次 $10.00 (環境変数で変更可)

## When to Use
- Xのトレンドやリアルタイムの反応を知りたいとき
- 記事のネタは決まっているが、Xでの盛り上がり・一次情報が足りないとき
- 海外の投稿を含めたリサーチが必要なとき
- 通常のWeb検索では拾えないX上の声を集めたいとき

## Required Intake
- **何を調べるか** (日本語でOK) → `--topic` に渡す
- **対象**: engineer or investor → `--audience` に渡す
- **ロケール**: ja (日本語優先) or global → `--locale` に渡す
- **期間**: 直近N日 (デフォルト30日) → `--days` に渡す

## Workflow

### Step 1: トピック確認
ユーザーの入力をそのまま検索トピックとして使用する。

### Step 2: 予算確認
`data/context-research/.usage_log.json` の利用ログを確認し、日次・月次の上限内であることを確認する。

### Step 3: Grok (x_search) に委任
以下のコマンドを実行して Context Pack を生成する:

```bash
npx tsx scripts/grok_context_research.ts \
  --topic "トピック名" \
  --locale ja \
  --audience engineer \
  --days 30
```

### Step 4: 結果の確認
`data/context-research/` に生成された `.md` ファイルの内容を確認し、ユーザーに要約を提示する。

### Step 5: 必要に応じて深掘り
結果が不足している場合は、`--locale global` や `--days 7` などパラメータを変えて再実行する。

## Output
- **保存先**: `data/context-research/`
- **ファイル形式**:
  - `YYYYMMDD_HHMMSSZ_ja_context.md` — Markdown Context Pack (メイン出力)
  - `YYYYMMDD_HHMMSSZ_ja_context.json` — リクエスト・レスポンス全体 (監査用)
  - `YYYYMMDD_HHMMSSZ_ja_context.txt` — テキストのみ抽出版
- **テンプレート**: `skills/article-agent-context-research/references/context_pack_template.md`

## Options

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `--topic` | 検索トピック (必須) | — |
| `--locale` | `ja` / `global` | `ja` |
| `--audience` | `engineer` / `investor` / `both` | `engineer` |
| `--days` | 直近N日以内 | `30` |
| `--out-dir` | 出力先 | `data/context-research` |
| `--dry-run` | API呼び出しせず確認のみ | `false` |
| `--daily-limit` | 日次コスト上限 (USD) | `1.00` |
| `--monthly-limit` | 月次コスト上限 (USD) | `10.00` |

## Cost Safety
- 各呼び出しのコスト概算を `data/context-research/.usage_log.json` に記録
- 日次・月次の上限を超える場合は自動でブロック
- `--dry-run` で事前にプロンプトと利用状況を確認可能
- 1回の呼び出しは概算 $0.05〜$0.15 程度

## Setup
1. xAI公式 (https://x.ai) でAPIキーを取得
2. `.env` に `XAI_API_KEY=your_key_here` を追加
3. `npx tsx scripts/grok_context_research.ts --topic "テスト" --dry-run` で動作確認

## Hand-off
- → article-agent-outliner (見出し作成)
- → article-agent-writer (本文執筆)
- → article-agent-research-factcheck (事後検証)
