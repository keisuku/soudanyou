-- ご近所ワイン DB スキーマ
-- Supabaseプロジェクト作成後、SQL Editorでこのファイルを実行してください

-- ワインテーブル
create table wines (
  id text primary key,
  name text not null,
  name_ja text not null,
  producer text not null,
  country text not null,
  country_code char(2) not null,
  region text,
  type text not null check (type in ('red','white','rose','sparkling')),
  grape_varieties text[] not null default '{}',
  description text not null default '',
  price integer not null,
  abv real not null,
  serving_temp text not null default '',
  pairings text[] default '{}',
  tags text[] default '{}',
  why_buy_now text not null default '',
  buzz_score integer default 0 check (buzz_score >= 0 and buzz_score <= 100),
  vivino_score real check (vivino_score is null or (vivino_score >= 0 and vivino_score <= 5)),
  cost_performance integer default 0 check (cost_performance >= 0 and cost_performance <= 100),
  tweet_urls text[] default '{}',
  status text default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ストア販売情報
create table wine_stores (
  id serial primary key,
  wine_id text not null references wines(id) on delete cascade,
  store_type text not null,
  store_name text not null,
  price integer not null check (price > 0),
  in_stock boolean default true,
  unique(wine_id, store_type)
);

-- 購入リンク
create table buy_links (
  id serial primary key,
  wine_id text not null references wines(id) on delete cascade,
  store text not null,
  url text not null,
  price integer check (price > 0)
);

-- X投稿の収集ログ（AIパイプライン用）
create table tweet_sources (
  id serial primary key,
  tweet_id text unique not null,
  tweet_url text not null,
  author_handle text,
  text_content text not null,
  like_count integer default 0,
  retweet_count integer default 0,
  wine_id text references wines(id) on delete set null,
  extracted_data jsonb,
  status text default 'pending' check (status in ('pending','processed','rejected')),
  fetched_at timestamptz default now()
);

-- インデックス
create index idx_wines_type on wines(type);
create index idx_wines_country on wines(country);
create index idx_wines_status on wines(status);
create index idx_wines_buzz on wines(buzz_score desc);
create index idx_wines_cospa on wines(cost_performance desc);
create index idx_wine_stores_wine on wine_stores(wine_id);
create index idx_wine_stores_type on wine_stores(store_type);
create index idx_buy_links_wine on buy_links(wine_id);
create index idx_tweet_sources_status on tweet_sources(status);
create index idx_tweet_sources_wine on tweet_sources(wine_id);

-- updated_at を自動更新するトリガー
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger wines_updated_at
  before update on wines
  for each row execute function update_updated_at();

-- Row Level Security
alter table wines enable row level security;
alter table wine_stores enable row level security;
alter table buy_links enable row level security;
alter table tweet_sources enable row level security;

-- 読み取りは誰でも可能（公開サイト）
create policy "wines_read" on wines for select using (true);
create policy "wine_stores_read" on wine_stores for select using (true);
create policy "buy_links_read" on buy_links for select using (true);

-- 書き込みはservice_roleのみ（API経由）
create policy "wines_insert" on wines for insert with check (true);
create policy "wines_update" on wines for update using (true);
create policy "wine_stores_insert" on wine_stores for insert with check (true);
create policy "wine_stores_update" on wine_stores for update using (true);
create policy "buy_links_insert" on buy_links for insert with check (true);
create policy "tweet_sources_all" on tweet_sources for all using (true);
