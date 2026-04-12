---
name: wine-x-collect
description: >-
  Use when the user wants to collect wine info from X (Twitter) for the
  soudanyou site, find buzz on a specific wine, or draft a new wine YAML
  from tweets. Triggers on phrases like "Xからワイン収集", "ワイン見つけて",
  "このワインのツイート探して", "collect wine from X".
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

# X ワイン収集 skill

## When to invoke

このスキルは以下のフレーズで起動する:
- 「Xからワイン収集」「ワイン見つけて」「このワインのツイート探して」
- 「collect wine from X」「find wine tweets」「wine buzz on X」

## Prerequisites check

**実行前に必ず以下を確認する。1つでも欠けていたら `docs/x-collection.md` を案内して停止。**

1. `agent-reach --version` が成功すること
2. カレントディレクトリが soudanyou リポジトリであること（`content/wines/` が存在）
3. `~/.agent-reach/config.yaml` が存在すること

```bash
agent-reach --version && test -d content/wines && test -f ~/.agent-reach/config.yaml
```

いずれかが失敗した場合:
> Agent Reach がセットアップされていません。`docs/x-collection.md` を参照してインストールと認証を完了してください。

## Step 1 — オペレーターにクエリを確認

**絶対にオペレーターの確認なしに検索を実行しない。**

オペレーターに以下を提示して承認を得る:
- 検索クエリ（例: `"ワイン おすすめ 安い"`）
- 取得件数（デフォルト: 20、最大: 20）

```
以下のクエリで X を検索します。よろしいですか？
  クエリ: "ワイン おすすめ 安い"
  件数: 20
```

## Step 2 — 検索実行

オペレーターの承認後にのみ実行する。

```bash
agent-reach search --query "<確認済みクエリ>" --limit 20 --json
```

出力を解析し、オペレーターに以下を報告:
- 取得件数
- 上位 3 件のツイートのプレビュー（テキスト冒頭 80 文字 + URL）

## Step 3 — 重複チェック

各ツイートについて、言及されているワインの生産者名・銘柄名を特定し、
既存の YAML ファイルと照合する。

```bash
grep -rl "<生産者名の一部>" content/wines/*.yaml
grep -rl "<銘柄名の一部>" content/wines/*.yaml
```

### 一致した場合（既存ワイン）

既存ファイルの `tweetUrls` 配列にツイート URL を追加する提案をする。
**自動で編集せず、オペレーターに差分を見せて承認を得る。**

```yaml
# 既存: content/wines/conosur-cabernet.yaml
tweetUrls:
  - https://x.com/existing/status/111
  - https://x.com/new_tweet/status/222  # ← 追加提案
```

### 一致しない場合（新規ワイン）

Step 4 へ進む。

## Step 4 — ドラフト YAML 作成

ツイートのテキストから以下のフィールドを可能な限り抽出し、
`content/wines/_drafts/<id>.yaml` に書き出す。

ID は `<生産者>-<銘柄>` を kebab-case で生成（`/^[a-z0-9-]+$/`）。

ツイートから確実に抽出できるフィールド:
- `name`, `nameJa`, `producer`, `country`, `countryCode`, `type`, `grapeVarieties`
- `description`（ツイート内容をベースに記述）
- `tweetUrls`（該当ツイート URL）
- `tags`（ツイートから推測）

**ツイートだけでは通常わからないフィールドには `# TODO:` コメントを付ける:**

```yaml
price: 0  # TODO: 実際の価格を調べて入力
abv: 0  # TODO: ABV を調べて入力
servingTemp: "TODO"  # TODO: 適温を調べて入力
stores:  # TODO: 取扱店舗を調べて入力
  - type: rakuten
    name: 楽天
    price: 0
    inStock: true
buyLinks:  # TODO: 購入リンクを調べて入力
  - store: 楽天
    url: https://search.rakuten.co.jp/search/mall/TODO/
    price: 0
buzzScore: 50  # TODO: バズスコアを調整
vivinoScore: null  # TODO: Vivino スコアを確認
costPerformance: 50  # TODO: コスパスコアを調整
```

### discoveredFrom フィールド

新規ドラフトには provenance 情報を自動で付与する:

```yaml
discoveredFrom:
  tweetUrl: https://x.com/user/status/123456
  collectedAt: "2026-04-12T00:00:00Z"  # 収集日時（ISO 8601）
  query: "ワイン おすすめ 安い"  # 検索に使ったクエリ
```

## Step 5 — バリデーション

ドラフトを Zod スキーマでバリデーションする。
`build-wines.ts` は `_drafts/` を無視するので、インラインで検証する。

```bash
npx tsx -e "
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { wineSchema } from './src/lib/wine-schema';
const raw = readFileSync('content/wines/_drafts/<id>.yaml', 'utf-8');
const result = wineSchema.safeParse(parse(raw));
if (!result.success) {
  console.error(JSON.stringify(result.error.issues, null, 2));
  process.exit(1);
}
console.log('Valid');
"
```

バリデーションエラーが出た場合はオペレーターに報告し、修正を提案する。

## Step 6 — 本番への昇格

オペレーターの承認後:

```bash
mv content/wines/_drafts/<id>.yaml content/wines/<id>.yaml
npm run wines:build
```

`Built N wines → ...` の出力を報告する。

## Step 7 — コミット提案

ファイルをステージングし、コミットメッセージを提案する。
**自動コミットは絶対にしない。オペレーターの明示的な承認を待つ。**

```
以下のファイルをコミットしますか？
  新規: content/wines/<id>.yaml
  メッセージ: "feat(wines): add <銘柄名> discovered from X"
```

## Failure modes

| 状況 | 対処 |
|------|------|
| レート制限 | 30秒待ってリトライ。2回目も失敗したら 5 分待つ |
| Cookie 期限切れ | `docs/x-collection.md` の認証セクションを案内 |
| バリデーション失敗 | エラー内容を表示し、Step 4 に戻って修正 |
| 重複検出 | Step 3 の追加フローに切り替え |
| ネットワークエラー | エラーメッセージを表示し、リトライを提案 |

## Out of scope

このスキルでは以下を **行わない**:
- X への投稿
- 既存ワインの削除
- スキーマの変更
- オペレーターの承認なしのコミット
- Agent Reach のインストールや設定変更
