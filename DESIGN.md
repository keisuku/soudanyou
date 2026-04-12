# DESIGN.md — ご近所ワイン

> このファイルは AIエージェントが読み取り、一貫した UI を生成するためのデザインシステム文書です。
> 新しいページやコンポーネントを作成する際は、このガイドに従ってください。

## 概要

**ご近所ワイン** — コンビニ・スーパーで買える厳選ワインのキュレーションサイト。
「身近な店で、プロが選んだワインに出会える」体験を、温かみのあるUIで提供する。

| 項目 | 値 |
|------|-----|
| フレームワーク | Next.js 16 (App Router) + React 19 |
| スタイリング | Tailwind CSS v4 + CVA (class-variance-authority) |
| アイコン | Lucide React |
| クラス結合 | `cn()` = clsx + tailwind-merge |
| 言語 | 日本語ファースト |

---

## デザイン原則

### 1. 温かみのある親しみやすさ
クリーム色の背景 (`#faf7f2`) とダークブラウンの文字 (`#2d2320`) で、ワインショップに入ったような温もりを演出する。冷たいグレースケールは使わない。

### 2. ワインタイプの色分け
赤・白・ロゼ・泡の4タイプには常に一貫した色を割り当て、ユーザーが直感的に識別できるようにする。

| タイプ | グラデーション | カラー変数 |
|--------|---------------|-----------|
| 赤 | `from-red-800 via-red-700 to-red-900` | `--wine-red: #c23b5a` |
| 白 | `from-amber-200 via-yellow-100 to-amber-300` | `--wine-white: #e6c84a` |
| ロゼ | `from-pink-300 via-rose-200 to-pink-400` | `--wine-rose: #f0a0b8` |
| 泡 | `from-sky-300 via-cyan-200 to-blue-300` | `--wine-sparkling: #5bc0de` |

### 3. 情報密度と余白のバランス
ワインカードには価格・スコア・ペアリング・販売店など多くの情報を詰めるが、`gap`・`space-y`・丸みのある要素で圧迫感を避ける。

### 4. 控えめなインタラクション
派手なアニメーションは避け、`hover:scale-[1.02]`・`transition-colors`・`backdrop-blur` など微細な変化で上品さを保つ。

### 5. モバイルファースト
`grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3` のレスポンシブ設計。モバイルではハンバーガー + アコーディオンナビ。

---

## デザイントークン

### カラーパレット

#### 基本色

| 変数 | 値 | 用途 |
|------|-----|------|
| `--background` | `#faf7f2` | ページ背景（温かみのあるクリーム） |
| `--foreground` | `#2d2320` | 本文テキスト（ダークブラウン） |
| `--card` | `#ffffff` | カード・ポップオーバー背景 |
| `--card-foreground` | `#2d2320` | カード内テキスト |

#### ブランド色

| 変数 | 値 | 用途 |
|------|-----|------|
| `--primary` | `#e24c6e` | CTA、ロゴ、価格表示、ランクバッジ（ホットピンク/ロゼ） |
| `--primary-foreground` | `#ffffff` | primary 上のテキスト |
| `--secondary` | `#f3ece4` | タグ背景、フィルタチップ非活性、サブUI（ライトタン） |
| `--secondary-foreground` | `#5a4a3f` | secondary 上のテキスト |
| `--accent` | `#7c5ce0` | 特別な強調、アクセント要素（パープル） |
| `--accent-foreground` | `#ffffff` | accent 上のテキスト |

#### 状態色・UI色

| 変数 | 値 | 用途 |
|------|-----|------|
| `--destructive` | `#dc2626` | エラー、削除アクション |
| `--muted` | `#f3ece4` | 控えめな背景 |
| `--muted-foreground` | `#8a7a6e` | 補助テキスト、プレースホルダー |
| `--border` | `#e8ddd2` | 境界線（ライトベージュ） |
| `--input` | `#e8ddd2` | インプット境界線 |
| `--ring` | `#e24c6e` | フォーカスリング |

#### ワイン専用色

| 変数 | 値 | 用途 |
|------|-----|------|
| `--gold` | `#e8a830` | Vivinoスコア、星アイコン、ゴールドバッジ |
| `--wine-red` | `#c23b5a` | 赤ワインバッジ |
| `--wine-white` | `#e6c84a` | 白ワインバッジ |
| `--wine-rose` | `#f0a0b8` | ロゼワインバッジ |
| `--wine-sparkling` | `#5bc0de` | スパークリングバッジ |

> **Tailwind での使い方**: `bg-primary`, `text-gold`, `border-border` のように `@theme inline` で登録済み。

### タイポグラフィ

```
--font-sans: "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, sans-serif
--font-mono: ui-monospace, monospace
```

| 役割 | クラス | 例 |
|------|--------|-----|
| ページタイトル | `text-2xl font-bold` | セクション見出し |
| ロゴ | `text-xl font-bold text-primary` | 「ご近所ワイン」 |
| カードタイトル | `font-semibold leading-tight` | ワイン名 |
| ナビリンク | `text-sm font-medium` | ヘッダーナビ |
| 本文・説明 | `text-sm leading-snug` | whyBuyNow テキスト |
| ラベル・メタ | `text-xs font-semibold` | バッジ、フィルタラベル |
| ミニラベル | `text-[10px] font-bold` | ワインタイプ+度数 |
| 極小アイコン文字 | `text-[8px] font-bold` | 販売店ミニアイコン |

### 角丸 (Border Radius)

| トークン | 値 | 使い分け |
|----------|------|---------|
| `--radius-sm` | `0.375rem` | — |
| `--radius-md` | `0.5rem` | ボタン、インプット (`rounded-md`) |
| `--radius-lg` | `0.75rem` | — |
| `--radius-xl` | `1rem` | — |
| `rounded-full` | — | バッジ、チップ、ランクバッジ |
| `rounded-xl` | — | カード、ドロップダウンパネル |

---

## レイアウト

### 全体構造

```
<Header />          ← sticky top-0 z-50, h-16, backdrop-blur
<main class="flex-1">
  ...コンテンツ...
</main>
<Footer />          ← border-t, copyright
```

### コンテナ

| 要素 | 最大幅 | パディング |
|------|--------|-----------|
| ヘッダー・メインレイアウト | `max-w-7xl` (1280px) | `px-4 sm:px-6 lg:px-8` |
| コンテンツエリア | `max-w-5xl` | `px-4 sm:px-6 lg:px-8` |

### グリッドパターン

```html
<!-- ワインカード一覧 -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

<!-- メトリクス（詳細ページ） -->
<div class="grid grid-cols-3 gap-3">
```

### ヘッダー

```
sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md
```

- デスクトップ: 水平ナビ + ドロップダウン（お店/国）
- モバイル: ハンバーガー → アコーディオンメニュー
- ドロップダウンパネル: `rounded-xl border border-border bg-card shadow-xl`

---

## コンポーネント

### Button

**パス**: `src/components/ui/button.tsx`
**パターン**: CVA (class-variance-authority)

**ベースクラス**:
```
inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
disabled:pointer-events-none disabled:opacity-50
```

| バリアント | クラス |
|-----------|--------|
| `default` | `bg-primary text-primary-foreground shadow hover:bg-primary/90` |
| `destructive` | `bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90` |
| `outline` | `border border-border bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |

| サイズ | クラス |
|--------|--------|
| `default` | `h-9 px-4 py-2` |
| `sm` | `h-8 rounded-md px-3 text-xs` |
| `lg` | `h-10 rounded-md px-8` |
| `icon` | `h-9 w-9` |

### Badge

**パス**: `src/components/ui/badge.tsx`
**パターン**: CVA

**ベースクラス**:
```
inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
```

| バリアント | クラス | 用途 |
|-----------|--------|------|
| `default` | `border-transparent bg-primary text-primary-foreground` | プライマリバッジ |
| `secondary` | `border-transparent bg-secondary text-secondary-foreground` | タグ、フィルタ非活性 |
| `destructive` | `border-transparent bg-destructive text-destructive-foreground` | エラー |
| `outline` | `text-foreground` | ボーダーのみ |
| `wine` | `border-transparent bg-wine-red text-white` | ワイン関連 |
| `gold` | `border-transparent bg-gold text-background` | スコア、コスパ |

### Card

**パス**: `src/components/ui/card.tsx`

**ベースクラス**:
```
rounded-xl border border-border bg-card text-card-foreground shadow
```

| サブコンポーネント | クラス |
|-------------------|--------|
| `CardHeader` | `flex flex-col space-y-1.5 p-6` |
| `CardTitle` | `font-semibold leading-none tracking-tight` |
| `CardDescription` | `text-sm text-muted-foreground` |
| `CardContent` | `p-6 pt-0` |

### WineCard

**パス**: `src/components/wine/wine-card.tsx`

ドメイン固有の複合コンポーネント。Card を基盤に以下の要素を組み合わせる:

```
┌─────────────────────────────────┐
│ ███████████████████████████████ │ ← h-2 グラデーションカラーバー（ワインタイプ別）
│                                 │
│  [1] 赤 13.5%          ¥1,098  │ ← ランクバッジ + タイプラベル + 価格
│                                 │
│  ジスト グランレゼルバ          │ ← ワイン名 (font-semibold)
│  13年熟成グランレゼルバが...    │ ← whyBuyNow (text-muted-foreground)
│                                 │
│  ★ 3.8    🍴 唐揚げ  生ハム    │ ← Vivinoスコア + ペアリングタグ
│  [7][L][F]                      │ ← 販売店ミニアイコン
└─────────────────────────────────┘
```

**主要スタイル**:
- ホバー: `hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10`
- カラーバー: `h-2 bg-gradient-to-r` + タイプ別グラデーション
- ランクバッジ: `h-6 w-6 rounded-full bg-primary text-xs font-bold text-primary-foreground`
- 価格: `text-lg font-bold text-primary`
- Vivinoスコア: `text-sm font-medium text-gold` + `Star` アイコン (`fill-gold`)
- ペアリングタグ: `rounded bg-secondary px-1.5 py-0.5 text-[10px]`
- 販売店アイコン: `h-5 w-5 rounded bg-muted text-[8px] font-bold text-muted-foreground`

---

## アイコン

ライブラリ: **Lucide React** (`lucide-react`)

| アイコン | 用途 | 標準サイズ |
|---------|------|-----------|
| `Wine` | ロゴ | `h-6 w-6` |
| `Star` | 評価スコア（常に `fill-gold` で塗りつぶし） | `h-3.5 w-3.5` |
| `UtensilsCrossed` | フードペアリング | `h-3 w-3` |
| `Store` | 店舗ナビ | `h-4 w-4` |
| `Globe` | 国ナビ | `h-4 w-4` |
| `Search` | 検索 | `h-4 w-4` |
| `Menu` / `X` | ハンバーガー開閉 | `h-6 w-6` |
| `ChevronDown` | ドロップダウン | `h-3 w-3` / `h-4 w-4` |
| `ExternalLink` | 外部リンク | `h-4 w-4` |
| `ArrowLeft` | 戻る | `h-4 w-4` |

---

## インタラクションパターン

| パターン | 実装 |
|---------|------|
| ホバー（カード） | `transition-all duration-200 hover:scale-[1.02] hover:shadow-lg` |
| ホバー（リンク） | `transition-colors hover:text-foreground` |
| ホバー（ドロップダウン項目） | `hover:bg-secondary hover:text-foreground` |
| フォーカス | `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring` |
| ドロップダウン | クリックトグル + `useOutsideClick` で外側クリック閉じ |
| シェブロン回転 | `transition-transform` + 開時 `rotate-180` |
| フィルタ切替 | Badge の `variant` を `default` ↔ `outline` で切替 |
| 検索 | デバウンス 300ms + `pl-10` でアイコン付きインプット |

---

## ページパターン

### トップページ (`/`)
- ヒーローセクション + インラインワインデータ
- タイプ/予算/店舗/国のフィルタバー
- ソート（コスパ/話題/価格/Vivino）
- ワインカードグリッド

### 一覧ページ (`/wines`)
- 検索バー + フルフィルタ
- URLパラメータとフィルタ状態を同期
- `WineCard` のレスポンシブグリッド

### 詳細ページ (`/wines/[id]`)
- 戻るリンク + ヒーロー（バッジ + タイトル + サブタイトル）
- 3カラムメトリクスグリッド（価格/スコア/度数）
- Card セクション積み重ね（概要/ペアリング/販売店/購入リンク/ツイート）

---

## ユーティリティ

### `cn()` — クラス結合

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

常にこの `cn()` を使って条件付きクラスを結合すること。直接の文字列結合は禁止。

### `formatPrice()` — 価格フォーマット

```typescript
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(price);
}
// 例: formatPrice(1098) → "¥1,098"
```

### `formatDate()` — 日付フォーマット

```typescript
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ja-JP").format(new Date(date));
}
```
