# ご近所ワイン (soudanyou)

コンビニ・スーパーで買える手頃なワインをコスパと話題度で紹介する Next.js サイト。
**AIソムリエ機能** (xAI Grok) が、料理・気分・予算からカタログ内の1本を提案します。

## 主な機能

- 82本の厳選ワインカタログ（`content/wines/*.yaml` → ビルド時に `src/lib/__generated__/wines.json` を生成）
- 詳細ページ `/wines/[id]` は SSG で事前生成
- **AIソムリエ** `/api/sommelier` — Grok に相談してワインを3本提案
- **AI抽出パイプライン** `/api/pipeline/collect` + `/api/pipeline/extract` — Xポストから Grok でワイン情報を構造化抽出

## 開発

```bash
npm install
npm run dev      # localhost:3000/soudanyou
npm run build    # 本番ビルド (wines:build → next build)
```

## 環境変数

`.env.local` を作成（コミットしないこと）:

```bash
# Supabase (AI パイプラインとDB読み書きに必要)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# xAI Grok (AIソムリエ + 抽出パイプラインに必要)
XAI_API_KEY=xai-...
XAI_MODEL=grok-2-1212        # 任意。既定: grok-2-1212
XAI_BASE_URL=https://api.x.ai/v1  # 任意
```

xAI の API キーは https://console.x.ai で発行できます。

## デプロイ

API ルート（AIソムリエ等）は **サーバーランタイムが必要** なので、GitHub Pages のような静的ホスティングでは動きません。

- ✅ **Vercel / Netlify / Cloudflare Workers** — API ルートが動作します
- ⚠️ **GitHub Pages** — 静的ページのみ。AI機能は無効になります

Vercel の場合、環境変数をダッシュボードに登録するだけで `main` ブランチから自動デプロイされます。

## AIソムリエの使い方（API）

```bash
curl -X POST http://localhost:3000/soudanyou/api/sommelier \
  -H "Content-Type: application/json" \
  -d '{"question":"今夜は焼肉。2000円以下でおすすめは？"}'
```

レスポンス例:

```json
{
  "answer": "焼肉には果実味のしっかりした赤がおすすめです…",
  "suggestions": [
    { "id": "alpaca-cabernet-merlot", "reason": "...", "wine": { ... } }
  ]
}
```

## AI抽出パイプライン

1. `POST /api/pipeline/collect` に `{"tweetUrls":["https://x.com/.../status/..."]}` を送ってツイートを `tweet_sources` に登録
2. `POST /api/pipeline/extract` を叩くと、pending のツイートを Grok が1本ずつ処理して `extracted_data` を埋めます
3. `dryRun: true` でDB更新せずプロンプト検証可能

## ディレクトリ構成

```
src/
  app/
    page.tsx                    # トップページ（独自の65本ハードコード + AIソムリエFAB）
    wines/
      page.tsx                  # 全ワイン一覧（wines.json ベース）
      [id]/page.tsx             # 詳細（SSG）
    api/
      sommelier/route.ts        # Grok による提案API
      pipeline/
        collect/route.ts        # Xツイート収集
        extract/route.ts        # Grok による構造化抽出
  components/
    sommelier/ai-sommelier.tsx  # 右下FAB + 相談モーダル
    wine/wine-card.tsx          # 汎用カード
  lib/
    grok.ts                     # xAI クライアント（fetch直叩き）
    supabase.ts
    wines.ts
content/wines/*.yaml            # ワインデータのソース
```
