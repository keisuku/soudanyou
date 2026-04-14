@AGENTS.md

# Soudanyou (ご近所ワイン) - Project Guide

ワイン推薦サイト「ご近所ワイン」。近所のコンビニ・スーパー・酒屋で買えるコスパの良いワインを、X(Twitter)の口コミ・Vivinoスコア・コスパ指標とともに紹介する。

## Tech Stack

- **Framework:** Next.js 16.2.0 (App Router)
- **UI:** React 19, Tailwind CSS 4, Shadcn風自作UIコンポーネント, Lucide icons
- **Data:** YAML → Zodバリデーション → JSON ビルドパイプライン
- **DB (optional):** Supabase PostgreSQL (未設定時は静的JSONにフォールバック)
- **Deploy:** GitHub Pages (`basePath: "/soudanyou"`)
- **Language:** TypeScript 5, ESLint 9

## Directory Structure

```
content/wines/          # ワインデータ(YAML個別ファイル, 82本)
scripts/
  build-wines.ts        # YAML → JSON コンパイラ (Zod検証 + 格安タグ自動付与)
  migrate-to-supabase.ts # Supabase移行スクリプト
  export-wines-text.ts  # TSVエクスポート
src/
  app/
    layout.tsx          # ルートレイアウト (Twitter widget script読込)
    page.tsx            # トップページ (59本ハードコード版クライアントコンポーネント)
    not-found.tsx       # 404ページ
    wines/
      page.tsx          # ワイン一覧 (フィルタ・ソート・検索)
      [id]/page.tsx     # ワイン詳細 (generateStaticParams)
    api/pipeline/
      collect/route.ts  # ツイート収集API (スケルトン)
      extract/route.ts  # AI抽出API (スケルトン)
  components/
    layout/
      header.tsx        # スティッキーヘッダー (店舗/国ドロップダウン)
      footer.tsx        # フッター
    wine/
      wine-card.tsx     # ワインカード (タイプ別カラーバー, 店舗アイコン)
      tweet-embed.tsx   # Twitter埋め込み
    search/
      search-bar.tsx    # デバウンス検索 (300ms)
    home-filters.tsx    # トップページ用フィルター
    ui/                 # Badge, Button, Card, Input
  lib/
    __generated__/
      wines.json        # ビルド生成物 (gitignoreしていない)
    wine-schema.ts      # Zodスキーマ定義
    wines.ts            # データアクセス層 (Supabase優先 → JSON fallback)
    supabase.ts         # Supabaseクライアント初期化
    utils.ts            # formatPrice, formatDate等
  types/
    wine.ts             # Wine, Store, BuyLink 型定義
supabase/migrations/
  001_initial_schema.sql # DBスキーマ (wines, wine_stores, buy_links, tweet_sources)
```

## Data Flow

```
content/wines/*.yaml
  → scripts/build-wines.ts (npm run wines:build)
  → src/lib/__generated__/wines.json
  → src/lib/wines.ts (getWines / getWineById / wines定数)
  → ページコンポーネントで利用
```

- `npm run dev` / `npm run build` はまず `wines:build` を実行してからNext.jsを起動
- ¥1,000未満のワインには「格安ワイン」タグが自動付与される

## Wine Data Model (YAML)

```yaml
id: kebab-case-id          # a-z0-9 ハイフンのみ
name: English Name
nameJa: 日本語名
producer: Producer Name
country: Country            # France, Italy, Spain, Chile, South Africa, Australia, Germany, Japan, etc.
countryCode: XX             # 2文字ISOコード
region: リージョン名         # optional
type: red|white|rose|sparkling
grapeVarieties: [品種名]
description: >
  テイスティングノート
price: 1500                 # 基準価格(円)
abv: 13.5
servingTemp: "6-8℃"
stores:                     # 取扱店舗 (1つ以上必須)
  - type: store_type_key
    name: 表示名
    price: 1500
    inStock: true
tags: [タグ]
pairings: [合う料理]
whyBuyNow: 1行キャッチコピー
buzzScore: 0-100            # SNS話題度
vivinoScore: 0-5 or null    # Vivino評価
costPerformance: 0-100      # コスパ指標
tweetUrls: [X投稿URL]
buyLinks:
  - store: ストア名
    url: URL
    price: 1500
```

## Store Types

| カテゴリ | キー | 表示名 |
|---------|------|--------|
| コンビニ | seven, lawson, familymart | セブン, ローソン, ファミマ |
| スーパー | aeon, summit, ozeki, seijoishii, kaldi, life | イオン, サミット, オオゼキ, 成城石井, カルディ, ライフ |
| 酒屋 | kakuyasu, yamaya, biccamera, liquorman | カクヤス, ヤマヤ, ビックカメラ, リカマン |
| ネットショップ | rakuten, africaer, ginza_grandmarche, takamura, felicity, wine_ohashi, ukiuki | 楽天, アフリカー, 銀座グランマルシェ, タカムラコーヒー, フェリシティ, ワインおおはし, うきうきワイン |

wine-schema.tsにはさらに多くのstore typeが定義されている (amazon, wine_grocery, sa_wine_jp, miraido, mikuni_wine, budouya, shinanoya, tuscany, hasegawa, kagadaya, dragee, sankyushop, senmonten, local_super)

## Country Categories

フランス (ブルゴーニュ, シャンパーニュ, ボルドー, その他), イタリア, スペイン, チリ, 南アフリカ, オーストラリア, ドイツ, 日本

## Key Business Rules

1. **千円以下ワインはデフォルト非表示** - `/wines` ページで「格安ワインも表示」トグルで表示可能
2. **トップページは59本ハードコード** - `src/app/page.tsx` に直接データを埋め込んだクライアントコンポーネント (PRで全面刷新済み)
3. **ソート** - コスパ順(デフォルト), 話題度順, 安い順, 評価順
4. **フィルタ** - タイプ, 予算(1000-2000円 / 2000円〜), 店舗, 国(+地域), テキスト検索
5. **URLパラメータ連携** - `?store=`, `?country=`, `?region=` でフィルタ状態を共有可能
6. **ワイン詳細ページは静的生成** - `generateStaticParams()` で82ページ事前ビルド

## UI Conventions

- **ワインタイプ別カラー**: 赤=red-800系, 白=amber-200系, ロゼ=pink-300系, 泡=sky-300系
- **店舗アイコン**: 1-2文字の略称 (7, L, F, A, S, 大, 成, K, LF, カ, Y, B, リ, 楽, ア, 銀, タ, フ, お, う)
- **レスポンシブ**: 1列(モバイル) → 2列(タブレット) → 3列(デスクトップ)
- **日本語ファースト**: UI文言・コンテンツはすべて日本語

## Commands

```bash
npm run wines:build    # YAML → JSON コンパイル
npm run dev            # 開発サーバー (wines:build + next dev)
npm run build          # 本番ビルド (wines:build + next build)
npm run lint           # ESLint
```

## Deployment

- GitHub Pages via `.github/workflows/nextjs.yml` / `deploy.yml`
- `basePath: "/soudanyou"` (next.config.ts)
- `images.unoptimized: true` (静的エクスポート対応)

## Supabase (Optional)

- 環境変数: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- RLS: 読み取り=公開, 書き込み=service_role_only
- テーブル: wines, wine_stores, buy_links, tweet_sources
- 未設定時は自動的に静的JSONにフォールバック

## Recent Development History

- Grokで収集したワインデータを定期的に追加 (PR #21-#27)
- トップページを新UIに全面刷新 (59本ハードコード版)
- ワインデータTSVエクスポート機能追加
- X投稿URL紐付け完了 (全ワインに最低1件)
- tweetUrls1件化、千円以下ワインをデフォルト非表示化
- Supabase DB基盤 & AIパイプラインスケルトン構築
- YAML個別ファイルによるワインデータ管理基盤
- ストアメニュー階層化 & フィルター機能
- 国別メニュー追加

## Notes

- `src/app/page.tsx` は非常に大きいファイル (59本分のワインデータがハードコードされたクライアントコンポーネント)。将来的にはYAMLデータソースと統合すべき
- APIパイプライン (`/api/pipeline/collect`, `/api/pipeline/extract`) はスケルトン状態
- wineSchema (Zod) と Wine型 (TypeScript) で一部store typeの定義が異なる場合がある
