"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  CircleDollarSign,
  Crown,
  Flame,
  Globe2,
  Grape,
  Search,
  SlidersHorizontal,
  Store,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FavoriteButton } from "@/components/wine/favorite-button";
import { LazyTweetEmbed } from "@/components/wine/lazy-tweet-embed";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import heroBackground from "../../public/images/home-hero-bg.png";
import {
  homeWines,
  type HomeWine,
} from "@/lib/home-data";
import { countryCategories, storeLabels } from "@/lib/wines";
import { pickPrimaryTweetUrl } from "@/lib/tweets";
import type { WineType } from "@/types/wine";

const priceFmt = (price: number) => `¥${price.toLocaleString()}`;

const displayFont = {
  fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "YuMincho", serif',
};

const typeLabels: Record<WineType | "all", string> = {
  all: "すべて",
  red: "赤",
  white: "白",
  rose: "ロゼ",
  sparkling: "泡",
};

const typeTone: Record<WineType, string> = {
  red: "border-rose-200 bg-rose-50 text-rose-950",
  white: "border-amber-200 bg-amber-50 text-amber-950",
  rose: "border-pink-200 bg-pink-50 text-pink-950",
  sparkling: "border-yellow-200 bg-yellow-50 text-yellow-950",
};

const storeTone = [
  "border-emerald-200 bg-emerald-50 text-emerald-800",
  "border-blue-200 bg-blue-50 text-blue-800",
  "border-rose-200 bg-rose-50 text-rose-800",
  "border-stone-200 bg-stone-50 text-stone-700",
];

const foodPresets = [
  { label: "焼肉", query: "焼肉", icon: "🥩" },
  { label: "チーズ", query: "チーズ", icon: "🧀" },
  { label: "魚介", query: "魚", icon: "🐟" },
  { label: "パスタ", query: "パスタ", icon: "🍝" },
];

type SortKey = "buzz" | "cospa" | "price" | "rating";
type PriceFilter = "standard" | "bargain" | "under1500" | "1500to2000" | "over2000";
type FacetKey = "convenience" | "supermarket" | "liquor" | "online" | "country" | "grape" | "price";

const storeFacetGroups: Array<{
  key: Extract<FacetKey, "convenience" | "supermarket" | "liquor" | "online">;
  label: string;
  stores: string[];
}> = [
  { key: "convenience", label: "コンビニ", stores: ["seven", "lawson", "familymart"] },
  { key: "supermarket", label: "スーパー", stores: ["aeon", "summit", "ozeki", "seijoishii", "life"] },
  { key: "liquor", label: "酒屋", stores: ["kaldi", "shinanoya", "yamaya", "africaer", "kakuyasu", "liquorman"] },
  { key: "online", label: "ネット店舗", stores: ["rakuten", "amazon", "takamura", "felicity", "wine_ohashi", "ukiuki"] },
];

const primaryFacets: Array<{ key: FacetKey; label: string; Icon: LucideIcon }> = [
  { key: "convenience", label: "コンビニ", Icon: Store },
  { key: "supermarket", label: "スーパー", Icon: Store },
  { key: "liquor", label: "酒屋", Icon: Store },
  { key: "online", label: "ネット店舗", Icon: Store },
  { key: "country", label: "国別", Icon: Globe2 },
  { key: "grape", label: "品種別", Icon: Grape },
  { key: "price", label: "価格帯", Icon: CircleDollarSign },
];

const grapeFacets = ["カベルネ", "シャルドネ", "ピノ", "ソーヴィニヨン", "甲州", "リースリング"];

const priceFacets: Array<{ key: PriceFilter; label: string }> = [
  { key: "standard", label: "800円以上" },
  { key: "bargain", label: "格安ワイン" },
  { key: "under1500", label: "〜1,500円" },
  { key: "1500to2000", label: "1,501〜2,000円" },
  { key: "over2000", label: "2,001円〜" },
];

const allStoreOptions = Array.from(
  new Map(
    homeWines
      .flatMap((wine) => wine.raw.stores)
      .map((store) => [store.type, storeLabels[store.type] ?? store.name ?? store.type] as const),
  ),
)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "ja"));

const buzzLikes = (wine: HomeWine) => {
  const likes = Math.max(9800, Math.round((wine.raw.buzzScore * 128 + wine.cospa * 41) / 100) * 100);
  return likes >= 10000 ? `${(likes / 10000).toFixed(1)}万` : likes.toLocaleString();
};

const buzzReposts = (wine: HomeWine) => Math.max(820, wine.raw.buzzScore * 24).toLocaleString();

function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="ご近所バズワイン ホーム">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#7f0019] text-white shadow-sm sm:h-9 sm:w-9">
        <Wine className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#d6a22d] sm:h-2.5 sm:w-2.5" />
      </span>
      <span className="text-lg font-black tracking-normal text-[#620017] sm:text-xl">
        ご近所バズワイン
      </span>
    </Link>
  );
}

function StoreChip({ label, index = 0 }: { label: string; index?: number }) {
  return (
    <span className={`inline-flex min-h-8 items-center gap-1 rounded-md border px-2.5 text-xs font-black ${storeTone[index % storeTone.length]}`}>
      <Store className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function FoodChip({
  label,
  icon,
  onClick,
  active = false,
}: {
  label: string;
  icon?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 min-w-[82px] shrink-0 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-black shadow-sm transition sm:h-10 sm:min-w-[104px] sm:px-3 sm:text-sm ${
        active
          ? "border-[#8a001d] bg-[#8a001d] text-white"
          : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
      }`}
    >
      {icon && <span className="text-sm sm:text-base">{icon}</span>}
      {label}
    </button>
  );
}

function TweetMiniCard({
  wine,
  compact = false,
}: {
  wine: HomeWine;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-md border border-stone-200 bg-white shadow-sm ${compact ? "p-3" : "p-4"}`}>
      <div className="mb-2 flex items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-950 text-xs font-black text-white">
          X
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs font-black text-stone-900">ワイン好きの会社員</div>
          <div className="text-[11px] font-medium text-stone-400">@wine_life · 3時間前</div>
        </div>
      </div>
      <p className={`text-sm font-medium leading-6 text-stone-700 ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
        {wine.storeLabels[0] ?? "近所"}で見つけたこの1本、価格以上の満足感。{wine.pairings[0] ?? "今夜のごはん"}に合わせたら最高でした。 #ご近所バズワイン
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs font-bold text-stone-400">
        <span>♡ {Math.max(42, wine.raw.buzzScore * 3)}</span>
        <span>↗ {Math.max(12, Math.round(wine.cospa / 2))}</span>
        <span className="text-[#9b001f]">バズ度 {wine.raw.buzzScore}</span>
      </div>
    </div>
  );
}

function TweetPreviewFrame({
  wine,
  rank,
  compact = false,
}: {
  wine: HomeWine;
  rank?: number;
  compact?: boolean;
}) {
  const tweetUrl = pickPrimaryTweetUrl(wine.raw.tweetUrls);

  return (
    <div className="relative h-full overflow-hidden bg-[#fbf8f3]">
      {rank != null && (
        <span className="pointer-events-none absolute left-0 top-0 z-20 flex h-9 min-w-9 items-center justify-center rounded-br-lg bg-stone-950 px-2 text-sm font-black text-white shadow-sm">
          {rank}
        </span>
      )}
      {tweetUrl ? (
        <LazyTweetEmbed
          tweetUrl={tweetUrl}
          className="absolute inset-0"
          contentClassName={`pointer-events-none absolute left-1/2 top-[-214px] w-[500px] max-w-[250%] -translate-x-1/2 origin-top ${compact ? "scale-[0.64]" : "scale-[0.68]"}`}
        />
      ) : (
        <div className="p-3">
          <TweetMiniCard wine={wine} compact />
        </div>
      )}
    </div>
  );
}

function HeroTweetFeature({
  wine,
  tweetUrl,
}: {
  wine: HomeWine;
  tweetUrl?: string;
}) {
  return (
    <article id="hero-tweet" className="relative w-full max-w-[650px] overflow-hidden rounded-lg border border-[#8a001d]/30 bg-white shadow-[0_18px_45px_rgba(74,20,20,0.15)]">
      <div className="flex h-9 items-center justify-between bg-[#820019] px-3 text-white">
        <div className="flex items-center gap-2 text-sm font-black">
          <Flame className="h-4 w-4 fill-white" />
          実際にバズっている投稿
        </div>
        <span className="rounded-md border border-amber-300/50 bg-amber-200/10 px-2 py-0.5 text-[11px] font-black text-amber-100">
          詳細へ
        </span>
      </div>

      <div className="grid min-h-[340px] grid-cols-[minmax(0,0.62fr)_minmax(220px,0.38fr)]">
        <div className="relative overflow-hidden bg-[#fbf8f3]">
          {tweetUrl ? (
            <LazyTweetEmbed
              tweetUrl={tweetUrl}
              className="absolute inset-0"
              contentClassName="pointer-events-none absolute left-1/2 top-[-248px] w-[540px] max-w-[190%] -translate-x-1/2 origin-top scale-[0.82]"
            />
          ) : (
            <div className="p-3">
              <TweetMiniCard wine={wine} compact />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-16 text-white">
            <div className="line-clamp-1 text-sm font-black">
              {wine.catch}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between border-l border-stone-100 bg-white p-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8a001d]">X BUZZ</div>
            <div className="mt-1 text-[3.4rem] font-black leading-none tracking-normal text-[#8a001d]">
              {buzzLikes(wine)}
            </div>
            <div className="mt-1 text-sm font-black text-stone-950">いいね</div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-y border-stone-100 py-3">
              <div>
                <div className="text-[11px] font-black text-stone-400">リポスト</div>
                <div className="text-base font-black text-stone-950">{buzzReposts(wine)}</div>
              </div>
              <div>
                <div className="text-[11px] font-black text-stone-400">バズ度</div>
                <div className="text-base font-black text-stone-950">{wine.raw.buzzScore}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${typeTone[wine.type]}`}>
                {typeLabels[wine.type]}
              </span>
              <span className="truncate text-[11px] font-bold text-stone-500">{wine.country}</span>
            </div>
            <h2 className="line-clamp-2 text-xl font-black leading-tight tracking-normal text-stone-950">
              {wine.name}
            </h2>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-black tracking-normal text-[#8a001d]">{priceFmt(wine.price)}</span>
              <span className="pb-1 text-[11px] font-bold text-stone-400">税込目安</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {wine.storeLabels.slice(0, 2).map((store, index) => (
                <StoreChip key={store} label={store} index={index} />
              ))}
            </div>
          </div>
        </div>
        <Link
          href={`/wines/${wine.id}`}
          className="absolute inset-0 z-10"
          aria-label={`${wine.name} の詳細ページを見る`}
        />
      </div>
    </article>
  );
}

function RankingCard({
  wine,
  rank,
}: {
  wine: HomeWine;
  rank: number;
}) {
  return (
    <article className="relative grid min-h-[292px] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[0.46fr_0.54fr]">
      <div className="min-h-[220px] border-b border-stone-100 sm:min-h-full sm:border-b-0 sm:border-r">
        <TweetPreviewFrame wine={wine} rank={rank} compact />
      </div>
      <div className="flex min-w-0 flex-col p-4">
        <div className="mb-3 rounded-md bg-[#8a001d] px-3 py-2 text-white">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/70">likes</div>
          <div className="text-3xl font-black leading-none tracking-normal">{buzzLikes(wine)}</div>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${typeTone[wine.type]}`}>
            {typeLabels[wine.type]}
          </span>
          <span className="truncate text-xs font-bold text-stone-400">{wine.country}</span>
        </div>
        <h3 className="line-clamp-2 text-base font-black leading-snug tracking-normal text-stone-950">
          {wine.name}
        </h3>
        <div className="mt-2 text-xl font-black tracking-normal text-[#8a001d]">{priceFmt(wine.price)}</div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-y border-stone-100 py-2 text-xs">
          <span className="font-black text-[#a00025]">🔥 {wine.raw.buzzScore}</span>
          <span className="font-black text-amber-700">★ {wine.vivino?.toFixed(1) ?? "-"}</span>
          <span className="font-black text-emerald-700">A{wine.cospa >= 85 ? "+" : ""}</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {wine.storeLabels.slice(0, 3).map((store, index) => (
            <span key={store} className={`rounded border px-2 py-1 text-[11px] font-black ${storeTone[index % storeTone.length]}`}>
              {store}
            </span>
          ))}
        </div>
      </div>
      <Link
        href={`/wines/${wine.id}`}
        className="absolute inset-0 z-10"
        aria-label={`${wine.name} の詳細ページを見る`}
      />
    </article>
  );
}

function TypeChip({
  type,
  active,
  count,
  onClick,
}: {
  type: WineType | "all";
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-bold transition ${
        active
          ? "border-[#8a001d] bg-[#8a001d] text-white"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
      }`}
    >
      {typeLabels[type]}
      <span className={`text-xs ${active ? "text-white/70" : "text-stone-400"}`}>{count}</span>
    </button>
  );
}

function GridWineCard({
  wine,
  rank,
}: {
  wine: HomeWine;
  rank: number;
}) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute right-3 top-3 z-30">
        <FavoriteButton wineId={wine.id} size="sm" />
      </div>
      <div className="h-[156px] border-b border-stone-100">
        <TweetPreviewFrame wine={wine} rank={rank} />
      </div>
      <div className="p-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${typeTone[wine.type]}`}>
              {typeLabels[wine.type]}
            </span>
            <span className="text-[11px] font-bold text-stone-400">{wine.country}</span>
          </div>
          <h3 className="line-clamp-2 text-base font-black leading-snug text-stone-950">{wine.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{wine.catch}</p>
          <div className="mt-2 text-xl font-black text-[#8a001d]">{priceFmt(wine.price)}</div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-stone-100 py-2 text-xs font-black">
          <span className="text-[#a00025]">🔥 {wine.raw.buzzScore}</span>
          <span className="text-amber-700">★ {wine.vivino?.toFixed(1) ?? "-"}</span>
          <span className="text-emerald-700">コスパ {wine.cospa}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {wine.storeLabels.slice(0, 3).map((store, index) => (
            <span key={store} className={`rounded border px-2 py-1 text-[11px] font-black ${storeTone[index % storeTone.length]}`}>
              {store}
            </span>
          ))}
        </div>
      </div>
      <Link
        href={`/wines/${wine.id}`}
        className="absolute inset-0 z-20"
        aria-label={`${wine.name} の詳細ページを見る`}
      />
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<WineType | "all">("all");
  const [store, setStore] = useState("all");
  const [country, setCountry] = useState("all");
  const [grape, setGrape] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("standard");
  const [sort, setSort] = useState<SortKey>("buzz");
  const [activeFacet, setActiveFacet] = useState<FacetKey | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const topWines = useMemo(
    () =>
      [...homeWines]
        .filter((wine) => wine.price >= 800)
        .sort((a, b) => {
          if (b.raw.buzzScore !== a.raw.buzzScore) return b.raw.buzzScore - a.raw.buzzScore;
          return b.cospa - a.cospa;
        })
        .slice(0, 3),
    [],
  );

  const heroWine = useMemo(() => {
    const buzzWine = [...homeWines]
      .filter((wine) => wine.price >= 800 && wine.raw.tweetUrls.length > 0)
      .sort((a, b) => {
        if (b.raw.buzzScore !== a.raw.buzzScore) return b.raw.buzzScore - a.raw.buzzScore;
        return b.cospa - a.cospa;
      })[0];
    return buzzWine ?? topWines[0] ?? homeWines[0];
  }, [topWines]);

  const heroTweetUrl = useMemo(() => pickPrimaryTweetUrl(heroWine.raw.tweetUrls), [heroWine]);

  const typeCounts = useMemo(() => {
    return homeWines.filter((wine) => wine.price >= 800).reduce<Record<WineType | "all", number>>(
      (acc, wine) => {
        acc.all += 1;
        acc[wine.type] += 1;
        return acc;
      },
      { all: 0, red: 0, white: 0, rose: 0, sparkling: 0 },
    );
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return homeWines
      .filter((wine) => {
        const matchesQuery =
          normalized.length === 0 ||
          [
            wine.name,
            wine.country,
            wine.grape,
            wine.catch,
            ...wine.pairings,
            ...wine.storeLabels,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized);
        const matchesType = type === "all" || wine.type === type;
        const matchesStore = store === "all" || wine.raw.stores.some((item) => item.type === store);
        const matchesCountry = country === "all" || wine.country === country;
        const matchesGrape = grape === "all" || wine.grape.toLowerCase().includes(grape.toLowerCase());
        const matchesPrice =
          (priceFilter === "standard" && wine.price >= 800) ||
          (priceFilter === "bargain" && wine.price < 800) ||
          (priceFilter === "under1500" && wine.price >= 800 && wine.price <= 1500) ||
          (priceFilter === "1500to2000" && wine.price > 1500 && wine.price <= 2000) ||
          (priceFilter === "over2000" && wine.price > 2000);
        return matchesQuery && matchesType && matchesStore && matchesCountry && matchesGrape && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "price") return a.price - b.price;
        if (sort === "rating") return (b.vivino ?? 0) - (a.vivino ?? 0);
        if (sort === "cospa") return b.cospa - a.cospa;
        return b.raw.buzzScore - a.raw.buzzScore;
      });
  }, [country, grape, priceFilter, query, sort, store, type]);

  const visibleWines = filtered.slice(0, visibleCount);

  const jumpToSearch = () => {
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyFoodQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const applyStoreFilter = (value: string) => {
    setStore(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const applyCountryFilter = (value: string) => {
    setCountry(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const applyGrapeFilter = (value: string) => {
    setGrape(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const applyPriceFilter = (value: PriceFilter) => {
    setPriceFilter(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const activeStoreGroup = storeFacetGroups.find((group) => group.key === activeFacet);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f2eb] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-white/55 bg-[#faf6ef]/72 shadow-[0_6px_22px_rgba(92,55,34,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1720px] items-center justify-between px-4 sm:h-16 sm:px-6">
          <AppLogo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="メインナビゲーション">
            <a href="#ranking" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">ランキング</a>
            <a href="#search" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">近くで買える</a>
            <a href="#search" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">料理で選ぶ</a>
            <a href="#hero-tweet" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">バズ投稿</a>
          </nav>

          <div className="hidden min-w-[420px] items-center rounded-lg border border-stone-200 bg-white px-3 shadow-sm xl:flex">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ワイン名・料理・お店で検索"
              className="h-11 flex-1 bg-transparent px-3 text-sm font-medium text-stone-900 outline-none placeholder:text-stone-400"
              aria-label="ワインを検索"
            />
          </div>

          <Link
            href="#search"
            className="hidden h-10 items-center justify-center rounded-md bg-[#8a001d] px-4 text-sm font-black text-white transition hover:bg-[#6f0018] lg:inline-flex"
          >
            ワインを探す
          </Link>
        </div>
      </header>

      <main>
        <section className="relative -mt-px overflow-hidden border-b border-stone-200 bg-[#faf6ef]">
          <Image
            src={heroBackground}
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none absolute inset-0 z-0 object-cover object-[70%_center] opacity-100 sm:object-[58%_center]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(250,246,239,0.9)_0%,rgba(250,246,239,0.52)_48%,rgba(250,246,239,0.08)_100%)] sm:bg-[linear-gradient(90deg,rgba(250,246,239,0.96)_0%,rgba(250,246,239,0.74)_36%,rgba(250,246,239,0.18)_70%,rgba(250,246,239,0.06)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-[#f7f2eb] to-transparent" />
          <div className="mx-auto grid max-w-[1720px] gap-3 px-4 pb-4 pt-3 sm:gap-6 sm:px-6 sm:py-6 lg:min-h-[520px] lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.58fr)] xl:min-h-[560px]">
            <div className="relative z-10 flex flex-col justify-start py-2 sm:py-6 lg:min-h-[460px] lg:justify-center lg:pr-8">
              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#8a001d]/20 bg-white/86 px-3 py-1.5 text-xs font-black text-[#8a001d] shadow-sm backdrop-blur sm:mb-5">
                <Flame className="h-3.5 w-3.5 fill-[#8a001d]" />
                Xでバズってるワインの情報をまとめました
              </div>
              <p className="mb-1 max-w-2xl text-sm font-black tracking-normal text-stone-900 sm:mb-4 sm:text-2xl" style={displayFont}>
                安くて美味しい
                <span className="mx-1 text-[#8a001d]">ワイン</span>
                は、どこで買えるの？
              </p>

              <div className="grid max-w-3xl grid-cols-[minmax(0,1fr)_88px] items-end gap-2 min-[390px]:grid-cols-[minmax(0,1fr)_98px] sm:block">
                <h1 className="min-w-0 max-w-full text-[2rem] font-black leading-[1.02] tracking-normal text-stone-950 min-[390px]:text-[2.08rem] sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[5.8rem]" style={displayFont}>
                  そのワイン、
                  <span className="block whitespace-nowrap text-[#8a001d]">ここにあります。</span>
                </h1>
                <div className="relative -mb-1 h-[126px] overflow-hidden rounded-[18px] shadow-[0_18px_35px_rgba(70,38,21,0.22)] sm:hidden">
                  <Image
                    src={heroBackground}
                    alt=""
                    fill
                    sizes="98px"
                    className="object-cover object-[88%_center]"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,246,239,0)_0%,rgba(250,246,239,0.10)_55%,rgba(250,246,239,0.34)_100%)]" />
                </div>
              </div>

              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-stone-800 sm:mt-6 sm:text-lg sm:leading-8">
                店舗と価格と品種など、もうワインに迷わない
              </p>

              <div className="mt-3 max-w-2xl rounded-lg border border-stone-200 bg-white/94 p-1.5 shadow-[0_14px_30px_rgba(87,50,35,0.10)] backdrop-blur sm:mt-7 sm:p-2">
                <div className="flex items-center gap-2">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-stone-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={jumpToSearch}
                    placeholder="ワイン名・料理・お店で検索"
                    className="h-9 min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-950 outline-none placeholder:text-stone-400 sm:h-12 sm:text-base"
                    aria-label="ワインを検索"
                  />
                  <button
                    type="button"
                    onClick={jumpToSearch}
                    className="hidden h-10 w-10 items-center justify-center rounded-md bg-stone-950 text-white transition hover:bg-[#8a001d] sm:flex"
                    aria-label="検索結果へ移動"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 sm:mt-6">
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
                  {primaryFacets.map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveFacet((value) => (value === key ? null : key))}
                      aria-pressed={activeFacet === key}
                      className={`inline-flex h-8 min-w-[82px] shrink-0 items-center justify-center gap-1 rounded-md border px-2 text-[11px] font-black shadow-sm transition sm:h-10 sm:min-w-[116px] sm:gap-1.5 sm:px-3 sm:text-sm ${
                        activeFacet === key
                          ? "border-[#8a001d] bg-[#8a001d] text-white"
                          : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFacet && (
              <div className="mt-1 sm:mt-5">
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
                  {activeStoreGroup?.stores.map((storeType) => (
                    <button
                      key={storeType}
                      type="button"
                      onClick={() => applyStoreFilter(storeType)}
                      aria-pressed={store === storeType}
                      className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-black shadow-sm transition sm:h-10 sm:text-sm ${
                        store === storeType
                          ? "border-[#8a001d] bg-[#8a001d] text-white"
                          : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
                      }`}
                    >
                      {storeLabels[storeType] ?? storeType}
                    </button>
                  ))}
                  {activeFacet === "country" &&
                    countryCategories.map((item) => (
                      <button
                        key={item.country}
                        type="button"
                        onClick={() => applyCountryFilter(item.label)}
                        aria-pressed={country === item.label}
                        className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-black shadow-sm transition sm:h-10 sm:text-sm ${
                          country === item.label
                            ? "border-[#8a001d] bg-[#8a001d] text-white"
                            : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  {activeFacet === "grape" &&
                    grapeFacets.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => applyGrapeFilter(item)}
                        aria-pressed={grape === item}
                        className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-black shadow-sm transition sm:h-10 sm:text-sm ${
                          grape === item
                            ? "border-[#8a001d] bg-[#8a001d] text-white"
                            : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  {activeFacet === "price" &&
                    priceFacets.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => applyPriceFilter(item.key)}
                        aria-pressed={priceFilter === item.key}
                        className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-xs font-black shadow-sm transition sm:h-10 sm:text-sm ${
                          priceFilter === item.key
                            ? "border-[#8a001d] bg-[#8a001d] text-white"
                            : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              </div>
              )}

              <div className="hidden">
                <div className="hidden text-sm font-black text-stone-900 sm:mb-3 sm:block">料理で選ぶ</div>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
                  {foodPresets.map((food) => (
                    <FoodChip
                      key={food.label}
                      label={food.label}
                      icon={food.icon}
                      active={query === food.query}
                      onClick={() => applyFoodQuery(food.query)}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden max-w-3xl grid-cols-3 gap-3 sm:mt-7">
                <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
                  <div className="text-xs font-black text-stone-400">今日の入口</div>
                  <div className="mt-1 text-xs font-black text-stone-950 sm:text-sm">X投稿を表示</div>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
                  <div className="text-xs font-black text-stone-400">見つかる場所</div>
                  <div className="mt-1 truncate text-xs font-black text-stone-950 sm:text-sm">{heroWine.storeLabels.slice(0, 2).join(" / ")}</div>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
                  <div className="text-xs font-black text-stone-400">価格の目安</div>
                  <div className="mt-1 text-xs font-black text-[#8a001d] sm:text-sm">{priceFmt(heroWine.price)}</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden items-center justify-end pt-1 lg:flex lg:pt-4">
              <HeroTweetFeature wine={heroWine} tweetUrl={heroTweetUrl} />
            </div>
          </div>
        </section>

        <section id="ranking" className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-[1720px] px-4 py-6 sm:px-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#d19a20]" />
                <h2 className="text-xl font-black tracking-normal text-stone-950 sm:text-2xl">
                  今日のバズワイン BEST 3
                </h2>
                <span className="hidden text-xs font-bold text-stone-400 sm:inline">更新: 12:00</span>
              </div>
              <Link href="/wines" className="inline-flex items-center gap-1 text-sm font-black text-stone-600 transition hover:text-[#8a001d]">
                もっと見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_230px]">
              {topWines.map((wine, index) => (
                <RankingCard key={wine.id} wine={wine} rank={index + 1} />
              ))}
              <div className="hidden rounded-lg border border-stone-200 bg-[#fbf8f3] p-4 xl:block">
                <div className="mb-3 text-sm font-black text-stone-950">スマホでもサクッと探せる</div>
                <ul className="space-y-2 text-xs font-bold leading-5 text-stone-600">
                  <li>・今いる場所から近いお店を表示</li>
                  <li>・気になった1本をお気に入り保存</li>
                  <li>・料理名だけでも候補が出る</li>
                </ul>
                <Link href="/quiz" className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-stone-950 px-3 text-xs font-black text-white">
                  診断で探す
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="search" className="mx-auto max-w-[1720px] px-4 py-10 sm:px-6">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a001d]">Find Your Bottle</p>
              <h2 className="mt-1 text-2xl font-black tracking-normal text-stone-950 sm:text-3xl">
                近所で買えるワインを探す
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {foodPresets.map((food) => (
                <FoodChip
                  key={food.label}
                  label={food.label}
                  icon={food.icon}
                  active={query === food.query}
                  onClick={() => {
                    setQuery(food.query);
                    setVisibleCount(12);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(12);
                  }}
                  placeholder="ワイン名・料理・お店・品種で検索"
                  className="h-12 w-full rounded-md border border-stone-200 bg-stone-50 pl-10 pr-4 text-base font-medium text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#8a001d] focus:bg-white"
                  aria-label="ワインを検索"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-stone-200 px-4 text-sm font-black text-stone-700 transition hover:border-stone-400 lg:w-auto"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="h-4 w-4" />
                絞り込み
                <ChevronDown className={`h-4 w-4 transition ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {(["all", "red", "white", "sparkling", "rose"] as const).map((item) => (
                <TypeChip
                  key={item}
                  type={item}
                  active={type === item}
                  count={typeCounts[item]}
                  onClick={() => {
                    setType(item);
                    setVisibleCount(12);
                  }}
                />
              ))}
            </div>

            {showFilters && (
              <div className="mt-4 grid gap-3 border-t border-stone-100 pt-4 md:grid-cols-5">
                <label className="block">
                  <span className="mb-1 block text-xs font-black text-stone-500">買えるお店</span>
                  <select
                    value={store}
                    onChange={(event) => {
                      setStore(event.target.value);
                      setVisibleCount(12);
                    }}
                    className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm font-bold text-stone-800"
                  >
                    <option value="all">すべて</option>
                    {allStoreOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-black text-stone-500">国</span>
                  <select
                    value={country}
                    onChange={(event) => {
                      setCountry(event.target.value);
                      setVisibleCount(12);
                    }}
                    className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm font-bold text-stone-800"
                  >
                    <option value="all">すべて</option>
                    {countryCategories.map((item) => (
                      <option key={item.country} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-black text-stone-500">品種</span>
                  <select
                    value={grape}
                    onChange={(event) => {
                      setGrape(event.target.value);
                      setVisibleCount(12);
                    }}
                    className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm font-bold text-stone-800"
                  >
                    <option value="all">すべて</option>
                    {grapeFacets.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-black text-stone-500">価格</span>
                  <select
                    value={priceFilter}
                    onChange={(event) => {
                      setPriceFilter(event.target.value as PriceFilter);
                      setVisibleCount(12);
                    }}
                    className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm font-bold text-stone-800"
                  >
                    <option value="standard">800円以上</option>
                    <option value="bargain">格安ワイン</option>
                    <option value="under1500">〜1,500円</option>
                    <option value="1500to2000">1,501〜2,000円</option>
                    <option value="over2000">2,001円〜</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-black text-stone-500">並び替え</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm font-bold text-stone-800"
                  >
                    <option value="buzz">バズ度順</option>
                    <option value="cospa">コスパ順</option>
                    <option value="price">安い順</option>
                    <option value="rating">評価順</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm font-medium text-stone-500">
              <span className="font-black text-stone-950">{filtered.length}</span> 本が見つかりました
            </p>
            {(query || type !== "all" || store !== "all" || country !== "all" || grape !== "all" || priceFilter !== "standard") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setType("all");
                  setStore("all");
                  setCountry("all");
                  setGrape("all");
                  setPriceFilter("standard");
                  setVisibleCount(12);
                }}
                className="text-sm font-black text-[#8a001d] hover:text-[#5f0014]"
              >
                条件をクリア
              </button>
            )}
          </div>

          {visibleWines.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-lg font-black text-stone-950">条件に合うワインが見つかりませんでした</p>
              <p className="mt-2 text-sm text-stone-500">お店や料理名を少し広めにして試してみてください。</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleWines.map((wine, index) => (
                <GridWineCard key={wine.id} wine={wine} rank={index + 1} />
              ))}
            </div>
          )}

          {filtered.length > visibleCount && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 12)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-6 text-sm font-black text-stone-800 transition hover:border-stone-500"
              >
                もっと見る（残り {filtered.length - visibleCount} 本）
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-[1720px] flex-col gap-4 px-4 py-8 text-sm text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-black text-stone-950">ご近所バズワイン</div>
            <p className="mt-1">価格は参考値です。最新の在庫と価格は各店舗でご確認ください。</p>
          </div>
          <div className="flex flex-wrap gap-4 font-bold">
            <Link href="/wines" className="hover:text-stone-950">全ワイン</Link>
            <Link href="/quiz" className="hover:text-stone-950">診断</Link>
            <a href="#ranking" className="hover:text-stone-950">ランキング</a>
            <a href="#hero-tweet" className="hover:text-stone-950">バズ投稿</a>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
