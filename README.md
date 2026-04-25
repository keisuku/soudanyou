# ご近所ワイン (soudanyou)

コンビニ・スーパーで買える手頃なワインをコスパと話題度で紹介する Next.js サイト。

## 主な機能

- 82本の厳選ワインカタログ（`content/wines/*.yaml` → ビルド時に `src/lib/__generated__/wines.json` を生成）
- 詳細ページ `/wines/[id]` は SSG で事前生成
- トップページに「いま、Xで話題の1本」ストリップ、献立マッチャー、お気に入り、比較、5問診断クイズ、今日の1本、ダークモード

## 開発

```bash
npm install
npm run dev      # localhost:3000/soudanyou
npm run build    # 本番ビルド (wines:build → next build → out/ を生成)
npm run lint
```


## トップページ再設計版の確認方法

「見当たらない」を防ぐため、確認手順を固定化しました。

1. `npm run dev` を実行
2. ブラウザで `http://localhost:3000/soudanyou` を開く
3. ファーストビューに次の2つが見えれば、再設計版が表示されています。
   - コピー: **「安くて美味しいワインは、どこで買えるの？」**
   - 見出し: **「実際にバズっている投稿」**

実装の参照先:
- `src/app/page.tsx`（トップページ本体）
- `docs/design/homepage-redesign.md`（再設計メモ）
- `docs/design/homepage-reference.png`（参考画像）

## 環境変数

`.env.local` を作成（コミットしないこと）:

```bash
NEXT_PUBLIC_SITE_URL=https://keisuku.github.io/soudanyou
```

## デプロイ

GitHub Pages 用に `output: "export"` で静的出力します。`main` への push で `.github/workflows/deploy.yml` が `out/` をビルド→Pages に公開。

## ディレクトリ構成

```
src/
  app/
    page.tsx                    # トップページ
    wines/
      page.tsx                  # 全ワイン一覧
      [id]/page.tsx             # 詳細（SSG）
    quiz/page.tsx               # 5問診断
    favorites/page.tsx          # お気に入り
    compare/page.tsx            # 比較
  components/
    wine/                       # wine-card, home-tweet-strip 等
    layout/
    ui/
  lib/
    home-data.ts                # トップ用の HomeWine プロジェクション
    wines.ts                    # 静的カタログ
    favorites.ts / recent.ts / compare-list.ts
content/wines/*.yaml            # ワインデータのソース
```
