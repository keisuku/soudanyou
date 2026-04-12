# X（Twitter）からのワイン情報収集ガイド

## 目的

X 上のワイン投稿（レビュー、話題、おすすめ）を効率的に収集し、
`content/wines/*.yaml` に追加できる形で取り込む。

**成功基準**: ツイート URL を捕捉 → ワインフィールドを抽出 → Zod バリデーション（`wineSchema`）を通過。

---

## ツール比較表

| 項目 | Agent Reach | XMCP | xurl |
|------|-------------|------|------|
| **コスト** | 無料 | X API 有料 ($100/mo Basic) | X API 有料 (~$0.01/tweet) |
| **認証** | Cookie（ブラウザ export） | OAuth 2.0 + API Key | OAuth 2.0 + API Key |
| **セットアップ** | CLI 1コマンド | MCP サーバー常駐 | CLI 1コマンド |
| **検索** | フルテキスト検索 | API search | API search/recent |
| **ツイート URL 出力** | あり（JSON） | あり | あり |
| **BAN リスク** | **あり**（非公式） | なし | なし |
| **Skill 適合** | 高い（CLI → JSON） | 低い（常駐プロセス） | 高い（CLI → JSON） |

---

## なぜ Agent Reach を既定にしたか

Agent Reach は無料で使え、1コマンドでインストールでき、JSON 出力が Claude Code skill と
相性が良く、フルテキスト検索で幅広いワイン投稿を拾える。
ただし非公式スクレイピングのため **X アカウント BAN のリスクがある**。
必ず専用の捨てアカウントを使い、レート制限を守ること。
リスクを許容できない場合は [ToS セーフな代替（xurl）](#tos-セーフな代替xurl) を参照。

---

## インストール

> **警告**: インストールスクリプトを `curl | bash` で実行する前に、必ずスクリプトの中身を
> 確認すること。まず `curl <url>` だけで取得・確認してから `bash` に渡す。
> **Claude Code skill からの自動インストールは行わない。**

```bash
# 標準インストール
curl -sSL https://raw.githubusercontent.com/Panniantong/Agent-Reach/main/install.sh | bash

# Safe mode（ヘッドレスブラウザ不使用）
curl -sSL https://raw.githubusercontent.com/Panniantong/Agent-Reach/main/install.sh | bash -s -- --safe
```

インストール後:

```bash
agent-reach --version
```

---

## 認証（Cookie 設定）

Agent Reach は X の Cookie を使って認証する。**絶対にメインアカウントを使わないこと。**

### 手順

1. **捨てアカウントで X にログイン**（ブラウザ）
2. [Cookie-Editor](https://cookie-editor.com/) 拡張機能をインストール
3. `x.com` の Cookie を JSON でエクスポート
4. 設定ファイルに保存:

```bash
mkdir -p ~/.agent-reach
# エクスポートした JSON をコピー
vim ~/.agent-reach/config.yaml
chmod 600 ~/.agent-reach/config.yaml
```

`config.yaml` の構造:

```yaml
auth:
  cookies: |
    [Cookie-Editor からエクスポートした JSON をここに貼り付け]
```

### セキュリティ注意

- Cookie ファイルの permission は `600`（owner のみ読み書き可）
- `.gitignore` に `~/.agent-reach/` を追加する必要はない（ホームディレクトリなので）
- Cookie は定期的に期限切れになる。ログインしなおして再エクスポートすること

---

## 日次運用フロー

### Step 1: 検索

```bash
agent-reach search --query "ワイン おすすめ 安い" --limit 20 --json > /tmp/wine-tweets.json
```

検索クエリ例:
- `"ワイン おすすめ 安い"` — 一般的な安ワイン
- `"コスパワイン"` — コスパ重視
- `"コノスル"` など具体的な銘柄名

### Step 2: ツイートからワイン情報を抽出

Claude Code の `wine-x-collect` skill を使うか、手動で JSON を読んでドラフトを作成する。

```bash
# skill 経由（推奨）
# Claude Code で: "Xからワイン収集して" or "/wine-x-collect"
```

### Step 3: ドラフトをレビュー

ドラフトは `content/wines/_drafts/` に保存される。

```bash
cat content/wines/_drafts/<id>.yaml
```

`# TODO:` コメントが付いたフィールドは手動で埋める必要がある（価格、店舗、ABV など）。

### Step 4: 本番へ昇格

```bash
mv content/wines/_drafts/<id>.yaml content/wines/<id>.yaml
```

### Step 5: ビルド確認

```bash
npm run wines:build
```

`Built N wines → ...` が表示されれば成功。

---

## 既存ワインの重複回避

新しいツイートが既にサイトに存在するワインについてのものである場合、新しいドラフトを
作成せずに、既存ファイルの `tweetUrls` 配列に URL を追加する。

### 手順

1. ツイートからワイン名・生産者を特定
2. 既存 YAML を検索:

```bash
grep -rl "producer: Vina Cono Sur" content/wines/*.yaml
```

3. 一致があれば、そのファイルの `tweetUrls` に新しい URL を追記:

```yaml
tweetUrls:
  - https://x.com/existing/status/111
  - https://x.com/new_tweet/status/222  # 追加
```

4. 一致がなければ `_drafts/` に新規ドラフトを作成

---

## ToS セーフな代替（xurl）

Agent Reach の BAN リスクを許容できない場合、X 公式の
[xurl](https://github.com/xdevplatform/xurl) を使う。

xurl は X API v2 を正式に利用するため ToS 違反のリスクはないが、
2026年4月時点で **無料枠が存在しない**（Basic プラン $200/mo、または従量課金 ~$0.01/tweet）。

```bash
# インストール
go install github.com/xdevplatform/xurl@latest

# 検索例
xurl GET "/2/tweets/search/recent?query=ワイン おすすめ&max_results=10&tweet.fields=text,author_id,created_at"
```

出力フォーマットは異なるが、ワークフローは同一:
検索 → 抽出 → ドラフト → レビュー → 昇格。

---

## リスクと緩和策

### アカウント BAN（Agent Reach）

| リスク | 緩和策 |
|--------|--------|
| スクレイピング検出による BAN | 捨てアカウントを使う。メインアカウント厳禁 |
| 過度なリクエスト | `--limit` を 20 以下に抑える。日次 1-2 回に制限 |
| Cookie 失効 | 定期的に再エクスポート |

### データ品質

| リスク | 緩和策 |
|--------|--------|
| ツイートに不完全な情報 | `# TODO:` マーカーで手動補完を促す |
| 誤ったワイン情報 | Zod バリデーション + 人間レビューの二重チェック |
| スパムツイート | 人間レビューで除外 |

### レート制限

Agent Reach を短時間に連続実行すると X 側でレート制限を受ける。
1 回の検索後、最低 30 秒は空ける。skill はこの制限を自動で守る。

---

## トラブルシューティング

### `Error: Authentication failed`

Cookie が期限切れ。X に再ログインし、Cookie を再エクスポートして
`~/.agent-reach/config.yaml` を更新する。

### `Error: Rate limited`

リクエスト頻度が高すぎる。5 分以上待ってから再試行。

### `agent-reach: command not found`

インストールされていない、または PATH が通っていない。

```bash
# PATH 確認
which agent-reach

# 再インストール
curl -sSL https://raw.githubusercontent.com/Panniantong/Agent-Reach/main/install.sh | bash
```

### Zod バリデーションエラー

`npm run wines:build` でエラーが出る場合、エラーメッセージの `path` を確認して
該当フィールドを修正する。

```
conosur-cabernet.yaml: stores.0.price: Expected number, received string
```

→ YAML の `price` が文字列になっている。クォートを外す。

### ドラフトがビルドに含まれてしまう

`content/wines/_drafts/` 内のファイルはビルドスクリプトに無視される
（`build-wines.ts` はトップレベルの `*.yaml` のみ読み込む）。
もし含まれてしまう場合、ファイルが `_drafts/` の外に置かれていないか確認。
