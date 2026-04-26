# ご近所バズワイン LP 引継書

作成日: 2026-04-26
ブランチ: `codex/homepage-redesign`

## 背景

LP のファーストビュー、X 投稿カード、ワイン一覧構成に対して、スマホ表示を中心に致命的な見切れや情報設計の問題があったため改修した。

主な要望は以下。

- スマホ最上部でもワインの存在感が必ず見えること
- 添付素材を単純貼り付けではなく、HTML/CSS と画像素材で再構成すること
- X 投稿はテキストより画像部分を大きく、縦長に見せること
- 全ワインを番号順ではなく、コンビニ・スーパー・酒屋・ネット店舗のジャンル棚として見せること

## 実装内容

### ファーストビュー

対象: `src/app/page.tsx`

- 添付素材から切り出したロゴ、街背景、ボトル、料理画像を `public/images/home-*` として配置。
- スマホ専用に、冒頭右側へボトルビジュアルを固定配置。
- スマホ冒頭に小型の「今夜のおすすめ」カードを追加し、細幅でもワイン・価格・買える店が見えるようにした。
- デスクトップでは背景写真、ボトル、料理、商品カードを重ねて、参考画像の構成に近づけた。

### X 投稿カード

対象: `src/app/page.tsx`, `src/components/wine/lazy-tweet-embed.tsx`

- ランキングカードとジャンル棚カードを縦長化。
- X 投稿の埋め込み表示領域を `aspect-[4/5]` ベースにして、画像部分が主役になるよう調整。
- X 埋め込みの遅延読み込み距離を `300px` から `1200px` に広げ、スクロール到達前に読み込まれやすくした。

### ジャンル別一覧

対象: `src/app/page.tsx`

- `wineShelfSections` を追加し、検索結果を以下の棚に分割。
  - コンビニで買える
  - スーパーで買える
  - 酒屋で買える
  - ネット店舗で買える
- ジャンル棚のカードでは順位番号を非表示にし、単なる番号リスト感を解消。
- 棚ごとにストア絞り込みボタンを配置。

## 追加素材

主に使用中の素材:

- `public/images/home-hero-logo.png`
- `public/images/home-hero-street.png`
- `public/images/home-hero-bottle.png`
- `public/images/home-hero-prosciutto.png`
- `public/images/home-hero-photo-strip.png`
- `public/images/home-food-yakiniku.png`
- `public/images/home-food-cheese.png`
- `public/images/home-food-seafood.png`
- `public/images/home-food-pasta.png`

参考・再編集用として残している素材:

- `public/images/home-firstview-reference.png`
- `public/images/home-firstview-mobile-reference.png`
- `public/images/home-hero-bottle-row.png`

## 検証

実行済み:

```bash
npm.cmd run lint
npm.cmd run build
```

どちらも成功。

ブラウザ確認:

- `http://localhost:3000/soudanyou`
- スマホ幅で、ファーストビュー冒頭にボトルとおすすめカードが見えることを確認。
- ランキングカード、ジャンル棚カードが縦長になっていることを確認。
- ジャンル棚が「コンビニ」「スーパー」「酒屋」「ネット店舗」で下方向に並ぶことを確認。

## 注意点・次に見るところ

- X 埋め込みは `platform.twitter.com` の読み込み状況に依存する。ネットワークやブロック環境では一時的に白い読み込み面が出る可能性がある。
- `home-firstview-reference.png` と `home-firstview-mobile-reference.png` は実装には直接使っていない。デザイン比較や次回調整用の参照素材として残している。
- 次に詰めるなら、X 埋め込みに頼らない投稿サムネイルの静的フォールバックを用意すると、表示速度と安定性が上がる。
