"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Crown,
  Heart,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { FavoriteButton } from "@/components/wine/favorite-button";
import { LazyTweetEmbed } from "@/components/wine/lazy-tweet-embed";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import heroBottle from "../../public/images/home-hero-bottle.png";
import heroLogo from "../../public/images/home-hero-logo.png";
import heroPhotoStrip from "../../public/images/home-hero-photo-strip.png";
import heroProsciutto from "../../public/images/home-hero-prosciutto.png";
import heroStreet from "../../public/images/home-hero-street.png";
import foodCheese from "../../public/images/home-food-cheese.png";
import foodPasta from "../../public/images/home-food-pasta.png";
import foodSeafood from "../../public/images/home-food-seafood.png";
import foodYakiniku from "../../public/images/home-food-yakiniku.png";
import {
  homeWines,
  type HomeWine,
} from "@/lib/home-data";
import { countryCategories, storeLabels } from "@/lib/wines";
import { pickPrimaryTweetUrl } from "@/lib/tweets";
import type { WineType } from "@/types/wine";

const priceFmt = (price: number) => `¥${price.toLocaleString()}`;

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

const heroFoodChips = [
  { label: "焼肉", query: "焼肉", image: foodYakiniku },
  { label: "チーズ", query: "チーズ", image: foodCheese },
  { label: "魚介", query: "魚", image: foodSeafood },
  { label: "パスタ", query: "パスタ", image: foodPasta },
];

type SortKey = "buzz" | "cospa" | "price" | "rating";
type PriceFilter = "standard" | "bargain" | "under1500" | "1500to2000" | "over2000";

const grapeFacets = ["カベルネ", "シャルドネ", "ピノ", "ソーヴィニヨン", "甲州", "リースリング"];

const allStoreOptions = Array.from(
  new Map(
    homeWines
      .flatMap((wine) => wine.raw.stores)
      .map((store) => [store.type, storeLabels[store.type] ?? store.name ?? store.type] as const),
  ),
)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "ja"));

const wineShelfSections = [
  {
    key: "convenience",
    title: "コンビニで買える",
    description: "セブン・ローソン・ファミマで今夜すぐ探しやすい話題の1本。",
    storeTypes: ["seven", "lawson", "familymart"],
  },
  {
    key: "supermarket",
    title: "スーパーで買える",
    description: "イオン、サミット、成城石井など、普段の買い物ついでに見つかる棚。",
    storeTypes: ["aeon", "summit", "ozeki", "seijoishii", "life", "local_super"],
  },
  {
    key: "liquor",
    title: "酒屋で買える",
    description: "カルディ、信濃屋食品、やまや、アフリカーなどで探せる本命ワイン。",
    storeTypes: ["kaldi", "shinanoya", "yamaya", "africaer", "kakuyasu", "biccamera", "liquorman", "hasegawa", "kagadaya", "mikuni_wine", "miraido"],
  },
  {
    key: "online",
    title: "ネット店舗で買える",
    description: "楽天、Amazon、専門店から在庫を見つけやすいオンライン向けの候補。",
    storeTypes: ["rakuten", "amazon", "ginza_grandmarche", "takamura", "felicity", "wine_ohashi", "ukiuki", "budouya", "dragee", "sa_wine_jp", "sankyushop", "senmonten", "tuscany", "wine_grocery"],
  },
] as const;

const buzzLikes = (wine: HomeWine) => {
  const likes = Math.max(9800, Math.round((wine.raw.buzzScore * 128 + wine.cospa * 41) / 100) * 100);
  return likes >= 10000 ? `${(likes / 10000).toFixed(1)}万` : likes.toLocaleString();
};

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
          contentClassName={`pointer-events-none absolute left-1/2 top-[-242px] w-[500px] max-w-[250%] -translate-x-1/2 origin-top ${compact ? "scale-[0.78]" : "scale-[0.86]"}`}
        />
      ) : (
        <div className="p-3">
          <TweetMiniCard wine={wine} compact />
        </div>
      )}
    </div>
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
    <article className="relative flex min-h-[560px] flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/5] border-b border-stone-100 xl:aspect-auto xl:h-[380px]">
        <TweetPreviewFrame wine={wine} rank={rank} compact />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="mb-3 flex items-end justify-between rounded-md bg-[#8a001d] px-3 py-2 text-white">
          <div>
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/70">likes</div>
          <div className="text-3xl font-black leading-none tracking-normal">{buzzLikes(wine)}</div>
          </div>
          <div className="text-right text-[11px] font-black text-white/70">Xで話題</div>
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
  rank?: number;
}) {
  return (
    <article className="relative flex min-h-[690px] flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute right-3 top-3 z-30">
        <FavoriteButton wineId={wine.id} size="sm" />
      </div>
      <div className="aspect-[4/5] border-b border-stone-100 xl:aspect-auto xl:h-[500px]">
        <TweetPreviewFrame wine={wine} rank={rank} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${typeTone[wine.type]}`}>
              {typeLabels[wine.type]}
            </span>
            <span className="text-[11px] font-bold text-stone-400">{wine.country}</span>
          </div>
          <h3 className="line-clamp-2 text-base font-black leading-snug text-stone-950">{wine.name}</h3>
          <p className="mt-1 line-clamp-1 text-xs leading-5 text-stone-500">{wine.catch}</p>
          <div className="mt-2 text-xl font-black text-[#8a001d]">{priceFmt(wine.price)}</div>
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 border-y border-stone-100 py-2 text-xs font-black">
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

  const groupedWines = useMemo(() => {
    return wineShelfSections
      .map((section) => {
        const storeTypeSet = new Set<string>(section.storeTypes);
        const shelfWines = filtered.filter((wine) =>
          wine.raw.stores.some((item) => storeTypeSet.has(item.type)),
        );

        return {
          ...section,
          wines: shelfWines.slice(0, visibleCount),
          total: shelfWines.length,
        };
      })
      .filter((section) => section.total > 0);
  }, [filtered, visibleCount]);

  const jumpToSearch = () => {
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyHeroQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const applyHeroStore = (value: string) => {
    setStore(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f2eb] text-stone-950">
      <main>
        <section className="relative isolate overflow-hidden border-b border-stone-200 bg-[#fbf7f1]">
          <Image
            src={heroStreet}
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none absolute inset-0 -z-20 object-cover object-[68%_center] opacity-95 sm:object-[72%_center] lg:object-[82%_center]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(251,247,241,0.96)_0%,rgba(251,247,241,0.80)_58%,rgba(251,247,241,0.24)_100%)] lg:bg-[linear-gradient(90deg,rgba(251,247,241,0.99)_0%,rgba(251,247,241,0.92)_34%,rgba(251,247,241,0.48)_58%,rgba(251,247,241,0.06)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#fbf7f1] to-transparent" />

          <div className="mx-auto max-w-[1720px] px-4 sm:px-6">
            <header className="flex h-12 items-center justify-between gap-4 sm:h-20">
              <Link href="/" className="flex shrink-0 items-center" aria-label="ご近所バズワイン ホーム">
                <Image
                  src={heroLogo}
                  alt="ご近所バズワイン"
                  priority
                  sizes="220px"
                  className="h-7 w-auto sm:h-11"
                />
              </Link>

              <nav className="hidden items-center gap-10 lg:flex" aria-label="メインナビゲーション">
                <a href="#ranking" className="text-sm font-black text-stone-950 transition hover:text-[#8a001d]">ランキング</a>
                <a href="#search" className="text-sm font-black text-stone-950 transition hover:text-[#8a001d]">近くで買える</a>
                <a href="#search" className="text-sm font-black text-stone-950 transition hover:text-[#8a001d]">料理で選ぶ</a>
                <Link href="/wines" className="text-sm font-black text-stone-950 transition hover:text-[#8a001d]">特集</Link>
              </nav>

              <div className="hidden h-12 min-w-[360px] items-center rounded-lg border border-stone-200 bg-white/90 px-4 shadow-sm backdrop-blur xl:flex">
                <Search className="h-5 w-5 text-stone-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ワイン名・料理・お店で検索"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-stone-900 outline-none placeholder:text-stone-400"
                  aria-label="ワインを検索"
                />
              </div>

              <div className="hidden items-center gap-5 md:flex">
                <Link href="/favorites" className="inline-flex items-center gap-2 text-sm font-black text-stone-950 transition hover:text-[#8a001d]">
                  <Heart className="h-5 w-5" />
                  お気に入り
                </Link>
                <Link href="/favorites" className="inline-flex items-center gap-2 text-sm font-black text-stone-950 transition hover:text-[#8a001d]">
                  <User className="h-5 w-5" />
                  マイページ
                </Link>
              </div>

              <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 bg-white/88 text-stone-950 shadow-sm md:hidden" aria-label="メニュー">
                <Menu className="h-5 w-5" />
              </button>
            </header>

            <div className="relative grid gap-4 pb-5 pt-1 sm:pb-8 lg:min-h-[540px] lg:grid-cols-[minmax(0,0.9fr)_minmax(500px,0.74fr)] lg:items-center lg:pt-0 xl:min-h-[600px]">
              <div className="pointer-events-none absolute right-[-78px] top-[-2px] z-0 h-[268px] w-[214px] sm:right-[-18px] sm:top-8 sm:h-[320px] sm:w-[240px] lg:hidden">
                <Image src={heroBottle} alt="" fill priority sizes="240px" className="object-contain object-bottom drop-shadow-[0_22px_22px_rgba(60,32,14,0.26)]" aria-hidden="true" />
              </div>
              <div className="pointer-events-none absolute bottom-[188px] right-[-54px] z-0 h-[78px] w-[210px] opacity-90 sm:hidden">
                <Image src={heroProsciutto} alt="" fill sizes="210px" className="object-contain drop-shadow-[0_18px_16px_rgba(70,35,18,0.18)]" aria-hidden="true" />
              </div>
              <div className="relative z-10 max-w-[760px]">
                <h1 className="max-w-[314px] text-[2.45rem] font-black leading-[0.98] tracking-normal text-stone-950 min-[390px]:max-w-[360px] min-[390px]:text-[2.82rem] sm:max-w-none sm:text-7xl lg:text-[5.5rem] xl:text-[6.4rem]" style={{ fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "YuMincho", serif' }}>
                  帰りに買える
                  <span className="block text-[#8a001d]">ワインを探そう！</span>
                </h1>
                <p className="mt-3 max-w-[270px] text-xs font-bold leading-6 text-stone-800 min-[390px]:max-w-[300px] sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-8">
                  Xで話題の“おいしいやつ”を、価格・お店・料理相性で整理。
                  コンビニ、スーパー、近所の酒屋から今夜の1本が見つかります。
                </p>

                <div className="relative z-10 mt-3 grid max-w-[360px] grid-cols-[72px_minmax(0,1fr)] items-center gap-2 overflow-hidden rounded-xl border border-white/75 bg-white/88 p-2 shadow-[0_16px_34px_rgba(68,38,22,0.18)] backdrop-blur sm:hidden">
                  <div className="relative h-24">
                    <Image src={heroBottle} alt="今夜のおすすめワイン" fill sizes="72px" className="object-contain object-bottom" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 inline-flex rounded bg-[#8a001d] px-2 py-0.5 text-[10px] font-black text-white">今夜のおすすめ</div>
                    <div className="line-clamp-2 text-sm font-black leading-snug text-stone-950">ゴキンジョ バズワイン ブリュット</div>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-2xl font-black tracking-normal text-[#8a001d]">¥1,280</span>
                      <span className="pb-0.5 text-[10px] font-bold text-stone-500">税込</span>
                    </div>
                    <div className="mt-1 flex gap-1.5">
                      {["セブン", "カルディ"].map((store, index) => (
                        <span key={store} className={`rounded border px-1.5 py-0.5 text-[10px] font-black ${storeTone[index % storeTone.length]}`}>
                          {store}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-7">
                  <div className="mb-2 text-xs font-black text-stone-950 sm:text-sm">料理で選ぶ</div>
                  <div className="grid grid-cols-2 gap-2 min-[380px]:grid-cols-4 sm:max-w-[560px] sm:gap-3">
                    {heroFoodChips.map((food) => (
                      <button
                        key={food.label}
                        type="button"
                        onClick={() => applyHeroQuery(food.query)}
                        className="flex h-12 items-center gap-1.5 rounded-lg border border-stone-200 bg-white/92 px-2 text-xs font-black text-stone-950 shadow-sm transition hover:border-[#8a001d]/40 hover:bg-white sm:h-16 sm:gap-2 sm:px-3 sm:text-sm"
                      >
                        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm sm:h-11 sm:w-11">
                          <Image src={food.image} alt="" fill sizes="44px" className="object-cover" aria-hidden="true" />
                        </span>
                        <span className="whitespace-nowrap">{food.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 sm:mt-6">
                  <div className="mb-2 text-xs font-black text-stone-950 sm:text-sm">クイックフィルター</div>
                  <div className="grid grid-cols-3 gap-2 sm:max-w-[560px] sm:gap-3">
                    <button
                      type="button"
                      onClick={() => applyHeroStore("seven")}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white/92 px-1.5 text-[11px] font-black text-stone-950 shadow-sm transition hover:border-[#8a001d]/40 hover:bg-white sm:h-12 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      近くで買える
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSort("buzz");
                        jumpToSearch();
                      }}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white/92 px-1.5 text-[11px] font-black text-stone-950 shadow-sm transition hover:border-[#8a001d]/40 hover:bg-white sm:h-12 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      Xで話題
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceFilter("under1500");
                        setVisibleCount(12);
                        jumpToSearch();
                      }}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white/92 px-1.5 text-[11px] font-black text-stone-950 shadow-sm transition hover:border-[#8a001d]/40 hover:bg-white sm:h-12 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-600 text-[10px] font-black text-emerald-700 sm:h-5 sm:w-5 sm:text-xs">¥</span>
                      1,500円以下
                    </button>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-0 left-[39%] hidden h-[390px] w-[310px] -translate-x-1/2 lg:block xl:h-[500px] xl:w-[390px]">
                <Image src={heroBottle} alt="" fill priority sizes="390px" className="object-contain drop-shadow-[0_34px_36px_rgba(45,24,10,0.28)]" aria-hidden="true" />
              </div>
              <div className="pointer-events-none absolute bottom-[-58px] left-[33%] hidden h-[160px] w-[430px] -translate-x-1/2 lg:block xl:h-[210px] xl:w-[560px]">
                <Image src={heroProsciutto} alt="" fill sizes="560px" className="object-contain drop-shadow-[0_22px_18px_rgba(70,35,18,0.18)]" aria-hidden="true" />
              </div>

              <div className="relative z-10 lg:justify-self-end">
                <article className="overflow-hidden rounded-xl border border-stone-200 bg-white/96 shadow-[0_22px_60px_rgba(55,31,18,0.15)] backdrop-blur">
                  <div className="grid gap-0 lg:grid-cols-[190px_minmax(0,1fr)_170px]">
                    <div className="relative min-h-[230px] bg-white px-4 pt-10 sm:min-h-[270px] lg:min-h-[360px]">
                      <div className="absolute left-0 top-0 rounded-br-lg bg-[#8a001d] px-5 py-2 text-sm font-black text-white">
                        今夜のおすすめ
                      </div>
                      <Image src={heroBottle} alt="ゴキンジョ バズワイン ブリュット" fill sizes="220px" className="object-contain object-bottom p-5" />
                    </div>

                    <div className="border-t border-stone-100 p-5 lg:border-l lg:border-t-0">
                      <h2 className="text-xl font-black leading-tight tracking-normal text-stone-950 sm:text-2xl">
                        ゴキンジョ バズワイン ブリュット
                      </h2>
                      <p className="mt-2 text-sm font-bold text-stone-600">🇫🇷 フランス / ヴァン・ムスー</p>
                      <div className="mt-5 flex items-end gap-2 border-b border-stone-200 pb-5">
                        <span className="text-4xl font-black tracking-normal text-stone-950">¥1,280</span>
                        <span className="pb-1 text-sm font-bold text-stone-500">税込</span>
                      </div>
                      <div className="mt-4">
                        <div className="text-xs font-black text-stone-500">買えるお店</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["セブン", "イオン", "カルディ", "成城石井"].map((store, index) => (
                            <span key={store} className={`rounded border px-2.5 py-1 text-xs font-black ${storeTone[index % storeTone.length]}`}>
                              {store}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="text-xs font-black text-stone-500">おすすめの料理</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["生ハム", "フライドチキン", "シーフード", "フルーツ"].map((item) => (
                            <span key={item} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-black text-stone-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-0 border-t border-stone-100 p-5 text-center lg:block lg:border-l lg:border-t-0 lg:text-left">
                      <div>
                        <div className="text-xs font-black text-stone-500">バズ度</div>
                        <div className="mt-2 text-2xl tracking-[0.1em] text-[#8a001d]">🔥🔥🔥🔥♨</div>
                      </div>
                      <div className="border-l border-stone-100 pl-3 lg:mt-7 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-5">
                        <div className="text-xs font-black text-stone-500">Vivino評価</div>
                        <div className="mt-2 text-4xl font-black tracking-normal text-stone-950">3.9</div>
                        <div className="mt-1 text-sm text-stone-950">★★★★<span className="text-stone-300">★</span></div>
                      </div>
                      <div className="border-l border-stone-100 pl-3 lg:mt-7 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-5">
                        <div className="text-xs font-black text-stone-500">コスパ</div>
                        <div className="mt-2 text-sm font-black text-stone-950">とても良い</div>
                        <div className="mt-2 flex justify-center gap-1 lg:justify-start">
                          {[0, 1, 2, 3, 4].map((dot) => (
                            <span key={dot} className={`h-3 w-3 rounded-full ${dot < 4 ? "bg-emerald-600" : "border border-emerald-600 bg-white"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 border-t border-stone-100 p-4 sm:grid-cols-[1fr_150px]">
                    <div className="flex gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-stone-950 text-2xl font-black text-white">X</span>
                      <p className="text-sm font-bold leading-6 text-stone-800">
                        泡好きの会社員 <span className="font-medium text-stone-500">@bubbly_love_jp · 5月10日</span><br />
                        きめ細かな泡とすっきりした酸味、コスパ最高の泡！家飲みが一気に華やかになる〜 🙌✨
                      </p>
                    </div>
                    <div className="relative hidden min-h-[82px] overflow-hidden rounded-lg sm:block">
                      <Image src={heroPhotoStrip} alt="" fill sizes="150px" className="object-cover object-[88%_center]" aria-hidden="true" />
                    </div>
                  </div>
                </article>
              </div>
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
              <span className="font-black text-stone-950">{filtered.length}</span> 本をジャンル別に表示中
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

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-lg font-black text-stone-950">条件に合うワインが見つかりませんでした</p>
              <p className="mt-2 text-sm text-stone-500">お店や料理名を少し広めにして試してみてください。</p>
            </div>
          ) : (
            <div className="mt-7 space-y-9">
              {groupedWines.map((section) => (
                <section key={section.key} aria-labelledby={`${section.key}-shelf-title`}>
                  <div className="mb-3 flex flex-col gap-2 border-b border-stone-200 pb-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8a001d]">Store Shelf</p>
                      <h3 id={`${section.key}-shelf-title`} className="mt-1 text-xl font-black tracking-normal text-stone-950 sm:text-2xl">
                        {section.title}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm font-bold leading-6 text-stone-500">{section.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {section.storeTypes.slice(0, 6).map((storeType, index) => (
                        <button
                          key={storeType}
                          type="button"
                          onClick={() => {
                            setStore(storeType);
                            setVisibleCount(12);
                          }}
                          className={`rounded border px-2 py-1 text-[11px] font-black transition hover:border-[#8a001d] ${storeTone[index % storeTone.length]}`}
                        >
                          {storeLabels[storeType] ?? storeType}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {section.wines.map((wine) => (
                      <GridWineCard key={`${section.key}-${wine.id}`} wine={wine} />
                    ))}
                  </div>
                  {section.total > visibleCount && (
                    <div className="mt-3 text-right text-xs font-black text-stone-400">
                      さらに {section.total - visibleCount} 本あります
                    </div>
                  )}
                </section>
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
                各ジャンルをもっと表示する
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
