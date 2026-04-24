"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bookmark,
  ChevronDown,
  Crown,
  Flame,
  LocateFixed,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  UserRound,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { FavoriteButton } from "@/components/wine/favorite-button";
import { FavoritesIndicator } from "@/components/wine/favorites-indicator";
import { HomeTweetStrip } from "@/components/wine/home-tweet-strip";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import {
  homeAllCountries,
  homeAllStores,
  homeWines,
  rakutenSearchUrl,
  type HomeWine,
} from "@/lib/home-data";
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

const quickFilters = [
  { label: "近くで買える", icon: LocateFixed, action: "store" },
  { label: "Xで話題", icon: X, action: "buzz" },
  { label: "1,500円以下", icon: ShoppingBag, action: "price" },
] as const;

type SortKey = "buzz" | "cospa" | "price" | "rating";
type PriceFilter = "all" | "under1500" | "1500to2000" | "over2000";

function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="ご近所バズワイン ホーム">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#7f0019] text-white shadow-sm">
        <Wine className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#d6a22d]" />
      </span>
      <span className="text-xl font-black tracking-normal text-[#620017] sm:text-2xl">
        ご近所バズワイン
      </span>
    </Link>
  );
}

function IconButton({
  label,
  Icon,
  badge,
}: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  badge?: number;
}) {
  return (
    <button
      type="button"
      className="relative flex h-10 min-w-10 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100"
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
      {badge != null && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9b001f] px-1 text-[10px] font-black text-white">
          {badge}
        </span>
      )}
    </button>
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
      className={`inline-flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-md border px-4 text-sm font-black shadow-sm transition ${
        active
          ? "border-[#8a001d] bg-[#8a001d] text-white"
          : "border-stone-200 bg-white text-stone-800 hover:border-[#8a001d]/40 hover:bg-rose-50"
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  );
}

function MetricBox({
  label,
  value,
  sub,
  tone = "rose",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "rose" | "gold" | "green";
}) {
  const toneClass = {
    rose: "text-[#a00025]",
    gold: "text-amber-700",
    green: "text-emerald-700",
  }[tone];

  return (
    <div className="min-w-0 border-l border-stone-200 pl-4 first:border-l-0 first:pl-0">
      <div className="text-xs font-black text-stone-500">{label}</div>
      <div className={`mt-1 text-2xl font-black tracking-normal ${toneClass}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] font-medium text-stone-400">{sub}</div>}
    </div>
  );
}

function BottleArt({
  type,
  label,
  size = "lg",
}: {
  type: WineType;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const isSparkling = type === "sparkling";
  const isWhite = type === "white";
  const bottleGradient = isSparkling
    ? "linear-gradient(90deg, #17140d, #353019 30%, #14120d 68%, #4b3d18)"
    : isWhite
    ? "linear-gradient(90deg, #5e5627, #bca95a 30%, #6a5e2c 68%, #d1bd66)"
    : "linear-gradient(90deg, #14080b, #3b111d 30%, #110609 70%, #4c1827)";
  const foil = isSparkling || isWhite ? "#c99a25" : "#7f0019";
  const dims = {
    sm: "h-36 w-16",
    md: "h-56 w-24",
    lg: "h-72 w-32 sm:h-80 sm:w-36",
  }[size];

  return (
    <div className={`relative mx-auto ${dims}`} aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-[28%] w-[32%] -translate-x-1/2 rounded-t-sm" style={{ background: bottleGradient }}>
        <div className="absolute inset-x-0 top-0 h-7 rounded-t-sm" style={{ background: foil }} />
      </div>
      <div className="absolute left-1/2 top-[22%] h-[11%] w-[48%] -translate-x-1/2 rounded-t-full" style={{ background: bottleGradient }} />
      <div className="absolute inset-x-[8%] bottom-0 h-[72%] rounded-t-[34px] rounded-b-lg shadow-[inset_10px_0_22px_rgba(255,255,255,0.16),inset_-16px_0_20px_rgba(0,0,0,0.24),0_22px_30px_rgba(0,0,0,0.20)]" style={{ background: bottleGradient }}>
        <div className="absolute left-[12%] top-[12%] h-[74%] w-[18%] rounded-full bg-white/10 blur-sm" />
        <div className="absolute inset-x-[14%] top-[38%] rounded-md border border-stone-300 bg-[#f7efe0] px-1 py-2 text-center shadow-sm">
          <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7f0019]">Gokinjo</div>
          <div className="mt-1 text-[18px] font-black leading-none text-stone-900" style={displayFont}>
            G
          </div>
          <div className="mt-1 line-clamp-2 text-[8px] font-bold leading-tight text-stone-600">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroScene({ wine }: { wine: HomeWine }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[34%] hidden w-[35%] overflow-hidden md:block">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,244,238,0),rgba(248,244,238,0.36)_20%,rgba(248,244,238,0)_80%)]" />
      <div className="absolute inset-y-0 right-0 w-[72%] bg-[linear-gradient(90deg,rgba(55,31,22,0),rgba(55,31,22,0.48))]" />
      <div className="absolute right-3 top-8 h-14 w-64 rotate-1 rounded-md border border-amber-200/50 bg-[#2b160d]/80 px-5 py-3 text-center text-lg font-black uppercase tracking-[0.18em] text-amber-200 shadow-2xl">
        Wine & Liquor
      </div>
      <div className="absolute bottom-0 right-5 h-[72%] w-56">
        <BottleArt type={wine.type} label={wine.name} />
      </div>
      <div className="absolute bottom-8 right-0 h-48 w-24 rounded-b-full rounded-t-[40px] border border-white/50 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06)_35%,rgba(255,255,255,0.22))] shadow-xl">
        <div className="absolute bottom-14 left-3 right-3 h-16 rounded-b-full bg-[linear-gradient(180deg,#f3d479,#d79c2a)] opacity-80" />
        <div className="absolute bottom-0 left-1/2 h-9 w-0.5 -translate-x-1/2 bg-white/70" />
      </div>
      <div className="absolute bottom-5 left-8 h-14 w-32 rounded-t-full bg-[#ad6d38]/80 blur-sm" />
    </div>
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

function RecommendedCard({
  wine,
  onOpen,
}: {
  wine: HomeWine;
  onOpen: (wine: HomeWine) => void;
}) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-[#8a001d]/35 bg-white shadow-[0_18px_45px_rgba(74,20,20,0.12)]">
      <div className="flex h-11 items-center justify-between bg-[#820019] px-4 text-white">
        <div className="flex items-center gap-2 text-base font-black">
          <Flame className="h-4 w-4 fill-white" />
          今夜のおすすめ
        </div>
        <span className="hidden rounded-md border border-amber-300/50 bg-amber-200/10 px-2 py-1 text-xs font-black text-amber-100 sm:inline-flex">
          編集部が厳選
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr_0.7fr]">
        <div className="flex items-center justify-center border-b border-stone-100 bg-[#fbf8f3] p-5 lg:border-b-0 lg:border-r">
          <BottleArt type={wine.type} label={wine.name} size="md" />
        </div>

        <div className="p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-xs font-black ${typeTone[wine.type]}`}>
              {typeLabels[wine.type]}
            </span>
            <span className="text-xs font-bold text-stone-500">{wine.country}</span>
            {wine.grape && <span className="text-xs font-bold text-stone-400">{wine.grape}</span>}
          </div>
          <h2 className="text-xl font-black leading-tight tracking-normal text-stone-950 sm:text-2xl">
            {wine.name}
          </h2>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-black tracking-normal text-[#8a001d]">{priceFmt(wine.price)}</span>
            <span className="pb-1 text-xs font-bold text-stone-400">税込目安</span>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-black text-stone-500">買えるお店</div>
            <div className="flex flex-wrap gap-2">
              {wine.storeLabels.slice(0, 4).map((store, index) => (
                <StoreChip key={store} label={store} index={index} />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-black text-stone-500">おすすめの料理</div>
            <div className="flex flex-wrap gap-2">
              {wine.pairings.slice(0, 4).map((pairing) => (
                <span key={pairing} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-black text-stone-700">
                  {pairing}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-stone-100 p-5 lg:block lg:border-l lg:border-t-0">
          <MetricBox label="バズ度" value={`${wine.raw.buzzScore}`} sub="/100" tone="rose" />
          <MetricBox label="Vivino" value={wine.vivino?.toFixed(1) ?? "-"} sub="星評価" tone="gold" />
          <MetricBox label="コスパ" value={wine.cospa >= 85 ? "高コスパ" : "良い"} sub={`${wine.cospa}点`} tone="green" />
        </div>
      </div>

      <div className="grid gap-3 border-t border-stone-100 bg-white p-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <TweetMiniCard wine={wine} compact />
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            type="button"
            onClick={() => onOpen(wine)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-200 px-4 text-sm font-black text-stone-700 transition hover:bg-stone-50"
          >
            <Bookmark className="h-4 w-4" />
            概要を見る
          </button>
          <Link
            href={`/wines/${wine.id}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#8a001d] px-4 text-sm font-black text-white transition hover:bg-[#6f0018]"
          >
            詳細とX投稿
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function RankingCard({
  wine,
  rank,
  onOpen,
}: {
  wine: HomeWine;
  rank: number;
  onOpen: (wine: HomeWine) => void;
}) {
  return (
    <article className="grid min-h-[190px] grid-cols-[92px_1fr] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onOpen(wine)}
        className="relative flex items-center justify-center bg-[#fbf8f3]"
        aria-label={`${wine.name} の概要を開く`}
      >
        <span className={`absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-br-lg text-lg font-black text-white ${rank === 1 ? "bg-[#d19a20]" : rank === 2 ? "bg-stone-500" : "bg-[#c46f21]"}`}>
          {rank}
        </span>
        <BottleArt type={wine.type} label={wine.name} size="sm" />
      </button>
      <div className="flex min-w-0 flex-col p-4">
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
    </article>
  );
}

function MobilePreview({ wine, rankings }: { wine: HomeWine; rankings: HomeWine[] }) {
  return (
    <div className="pointer-events-none hidden xl:block">
      <div className="relative h-[430px] w-[230px] rounded-[34px] border-[9px] border-stone-950 bg-white shadow-2xl">
        <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-stone-950" />
        <div className="h-full overflow-hidden rounded-[24px] bg-[#fbf8f3]">
          <div className="flex h-12 items-center justify-between border-b border-stone-200 bg-white px-3 pt-1">
            <Menu className="h-4 w-4 text-stone-700" />
            <span className="text-xs font-black text-[#7f0019]">ご近所バズワイン</span>
            <Bell className="h-4 w-4 text-stone-700" />
          </div>
          <div className="p-3">
            <div className="mb-3 flex h-8 items-center gap-2 rounded-full border border-stone-200 bg-white px-3 text-[11px] font-bold text-stone-400">
              <Search className="h-3.5 w-3.5" />
              ワイン名・料理で検索
            </div>
            <div className="mb-3 flex gap-1.5 overflow-hidden">
              {["焼肉", "チーズ", "魚介"].map((label) => (
                <span key={label} className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-stone-700 shadow-sm">
                  {label}
                </span>
              ))}
            </div>
            <div className="rounded-lg border border-[#8a001d]/30 bg-white">
              <div className="rounded-t-lg bg-[#8a001d] px-3 py-1.5 text-[11px] font-black text-white">今夜のおすすめ</div>
              <div className="grid grid-cols-[58px_1fr] gap-2 p-3">
                <BottleArt type={wine.type} label={wine.name} size="sm" />
                <div className="min-w-0">
                  <div className="line-clamp-2 text-xs font-black leading-snug text-stone-950">{wine.name}</div>
                  <div className="mt-1 text-base font-black text-[#8a001d]">{priceFmt(wine.price)}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {wine.storeLabels.slice(0, 2).map((store) => (
                      <span key={store} className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-700">
                        {store}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-stone-100 px-3 py-2 text-[10px] font-black">
                <span className="text-[#a00025]">🔥 {wine.raw.buzzScore}</span>
                <span className="text-amber-700">★ {wine.vivino?.toFixed(1) ?? "-"}</span>
                <span className="text-emerald-700">A</span>
              </div>
            </div>
            <div className="mt-3 text-xs font-black text-stone-900">今日のBEST 3</div>
            <div className="mt-2 space-y-2">
              {rankings.slice(0, 3).map((item, index) => (
                <div key={item.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 rounded-md bg-white p-2 shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d19a20] text-[10px] font-black text-white">{index + 1}</span>
                  <span className="truncate text-[10px] font-black text-stone-900">{item.name}</span>
                  <span className="text-[10px] font-black text-[#8a001d]">{priceFmt(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  onOpen,
}: {
  wine: HomeWine;
  rank: number;
  onOpen: (wine: HomeWine) => void;
}) {
  return (
    <article className="relative rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton wineId={wine.id} size="sm" />
      </div>
      <button
        type="button"
        onClick={() => onOpen(wine)}
        className="grid w-full grid-cols-[76px_1fr] gap-4 pr-8 text-left"
        aria-label={`${wine.name} の概要を開く`}
      >
        <div className="relative rounded-md bg-[#fbf8f3] py-2">
          <span className="absolute left-0 top-0 flex h-6 min-w-6 items-center justify-center rounded-br-md bg-stone-900 px-1 text-xs font-black text-white">
            {rank}
          </span>
          <BottleArt type={wine.type} label={wine.name} size="sm" />
        </div>
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
      </button>
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
    </article>
  );
}

function QuickView({ wine, onClose }: { wine: HomeWine | null; onClose: () => void }) {
  if (!wine) return null;
  const buyUrl = wine.buyUrl ?? rakutenSearchUrl(wine.name);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-2xl sm:rounded-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${typeTone[wine.type]}`}>
              {typeLabels[wine.type]}
            </span>
            <span className="text-xs font-medium text-stone-500">{wine.country}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-[130px_1fr] sm:p-6">
          <div className="rounded-lg bg-[#fbf8f3] p-3">
            <BottleArt type={wine.type} label={wine.name} size="md" />
          </div>
          <div>
            <h2 className="text-2xl font-black leading-tight tracking-normal text-stone-950 sm:text-3xl">
              {wine.name}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-stone-600">{wine.catch}</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-md border border-stone-200 p-3">
                <div className="text-xs font-medium text-stone-500">価格</div>
                <div className="mt-1 text-xl font-black text-[#8a001d]">{priceFmt(wine.price)}</div>
              </div>
              <div className="rounded-md border border-stone-200 p-3">
                <div className="text-xs font-medium text-stone-500">Vivino</div>
                <div className="mt-1 text-xl font-black text-stone-950">{wine.vivino?.toFixed(1) ?? "-"}</div>
              </div>
              <div className="rounded-md border border-stone-200 p-3">
                <div className="text-xs font-medium text-stone-500">バズ度</div>
                <div className="mt-1 text-xl font-black text-[#a00025]">{wine.raw.buzzScore}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-black text-stone-950">
                  <ShoppingBag className="h-4 w-4" />
                  買えるお店
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wine.storeLabels.map((store, index) => (
                    <StoreChip key={store} label={store} index={index} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-black text-stone-950">
                  <Utensils className="h-4 w-4" />
                  合う料理
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wine.pairings.map((pairing) => (
                    <span key={pairing} className="rounded-md bg-amber-50 px-2.5 py-1.5 text-sm font-bold text-amber-800">
                      {pairing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/wines/${wine.id}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#8a001d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#6f0018]"
              >
                詳細とX投稿を見る
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 py-3 text-sm font-black text-stone-800 transition hover:bg-stone-50"
              >
                購入先を探す
                <ShoppingBag className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<WineType | "all">("all");
  const [store, setStore] = useState("all");
  const [country, setCountry] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortKey>("buzz");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedWine, setSelectedWine] = useState<HomeWine | null>(null);

  const topWines = useMemo(
    () =>
      [...homeWines]
        .sort((a, b) => {
          if (b.raw.buzzScore !== a.raw.buzzScore) return b.raw.buzzScore - a.raw.buzzScore;
          return b.cospa - a.cospa;
        })
        .slice(0, 3),
    [],
  );

  const heroWine = useMemo(() => {
    const sparkling = [...homeWines]
      .filter((wine) => wine.type === "sparkling" && wine.price <= 1800)
      .sort((a, b) => {
        if (b.raw.buzzScore !== a.raw.buzzScore) return b.raw.buzzScore - a.raw.buzzScore;
        return b.cospa - a.cospa;
      })[0];
    return sparkling ?? topWines[0] ?? homeWines[0];
  }, [topWines]);

  const stats = useMemo(() => {
    const avgPrice = Math.round(homeWines.reduce((sum, wine) => sum + wine.price, 0) / homeWines.length);
    const tweetCount = homeWines.reduce((sum, wine) => sum + wine.raw.tweetUrls.length, 0);
    return {
      total: homeWines.length,
      avgPrice,
      stores: homeAllStores.length,
      tweets: tweetCount,
    };
  }, []);

  const typeCounts = useMemo(() => {
    return homeWines.reduce<Record<WineType | "all", number>>(
      (acc, wine) => {
        acc.all += 1;
        acc[wine.type] += 1;
        return acc;
      },
      { all: 0, red: 0, white: 0, rose: 0, sparkling: 0 },
    );
  }, []);

  const tweetWines = useMemo(
    () =>
      [...homeWines]
        .filter((wine) => wine.raw.tweetUrls.length > 0)
        .sort((a, b) => b.raw.buzzScore - a.raw.buzzScore)
        .slice(0, 3),
    [],
  );

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
        const matchesStore = store === "all" || wine.storeLabels.includes(store);
        const matchesCountry = country === "all" || wine.country === country;
        const matchesPrice =
          priceFilter === "all" ||
          (priceFilter === "under1500" && wine.price <= 1500) ||
          (priceFilter === "1500to2000" && wine.price > 1500 && wine.price <= 2000) ||
          (priceFilter === "over2000" && wine.price > 2000);
        return matchesQuery && matchesType && matchesStore && matchesCountry && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "price") return a.price - b.price;
        if (sort === "rating") return (b.vivino ?? 0) - (a.vivino ?? 0);
        if (sort === "cospa") return b.cospa - a.cospa;
        return b.raw.buzzScore - a.raw.buzzScore;
      });
  }, [country, priceFilter, query, sort, store, type]);

  const visibleWines = filtered.slice(0, visibleCount);

  const jumpToSearch = () => {
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyFoodQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(12);
    jumpToSearch();
  };

  const applyQuickFilter = (action: (typeof quickFilters)[number]["action"]) => {
    if (action === "store") {
      setStore(heroWine.storeLabels[0] ?? "all");
    }
    if (action === "buzz") {
      setSort("buzz");
    }
    if (action === "price") {
      setPriceFilter("under1500");
    }
    setVisibleCount(12);
    jumpToSearch();
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-stone-950">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1720px] items-center justify-between px-4 sm:px-6">
          <AppLogo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="メインナビゲーション">
            <a href="#ranking" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">ランキング</a>
            <a href="#search" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">近くで買える</a>
            <a href="#search" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">料理で選ぶ</a>
            <a href="#buzz-voice" className="text-sm font-black text-stone-900 transition hover:text-[#8a001d]">特集</a>
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

          <div className="flex items-center gap-2">
            <button type="button" className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-black text-stone-700 transition hover:bg-stone-100 md:inline-flex">
              <LocateFixed className="h-4 w-4" />
              現在地から探す
            </button>
            <FavoritesIndicator className="min-h-10 min-w-10 rounded-md text-stone-700 hover:bg-stone-100" />
            <IconButton label="通知" Icon={Bell} badge={3} />
            <IconButton label="ログイン" Icon={UserRound} />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-[#faf6ef]">
          <HeroScene wine={heroWine} />
          <div className="mx-auto grid max-w-[1720px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] xl:min-h-[640px]">
            <div className="relative z-10 flex min-h-[560px] flex-col justify-center py-8 lg:pr-8">
              <p className="mb-4 max-w-2xl text-lg font-black tracking-normal text-stone-900 sm:text-2xl" style={displayFont}>
                安くて美味しい
                <span className="mx-1 text-[#8a001d]">ワイン</span>
                は、どこで買えるの？
              </p>

              <h1 className="max-w-3xl text-[clamp(3.6rem,8vw,8.8rem)] font-black leading-[0.94] tracking-normal text-stone-950" style={displayFont}>
                そのワイン、
                <span className="block text-[#8a001d]">ここにあります。</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-stone-700 sm:text-lg">
                Xで話題の“おいしいやつ”を、価格・お店・料理相性で整理。
                コンビニ、スーパー、近所の酒屋から今夜の1本が見つかります。
              </p>

              <div className="mt-7 max-w-2xl rounded-lg border border-stone-200 bg-white p-2 shadow-[0_14px_30px_rgba(87,50,35,0.10)]">
                <div className="flex items-center gap-2">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-stone-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={jumpToSearch}
                    placeholder="ワイン名・料理・お店で検索"
                    className="h-12 min-w-0 flex-1 bg-transparent text-base font-medium text-stone-950 outline-none placeholder:text-stone-400"
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

              <div className="mt-6">
                <div className="mb-3 text-sm font-black text-stone-900">料理で選ぶ</div>
                <div className="flex flex-wrap gap-3">
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

              <div className="mt-5">
                <div className="mb-3 text-sm font-black text-stone-900">クイックフィルター</div>
                <div className="flex flex-wrap gap-3">
                  {quickFilters.map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => applyQuickFilter(action)}
                      className="inline-flex h-11 min-w-[136px] items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 text-sm font-black text-stone-800 shadow-sm transition hover:border-[#8a001d]/40 hover:bg-rose-50"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
                {tweetWines.map((wine) => (
                  <TweetMiniCard key={wine.id} wine={wine} compact />
                ))}
              </div>
            </div>

            <div className="relative z-10 grid items-start gap-5 xl:grid-cols-[1fr_230px]">
              <div className="pt-3 lg:pt-8">
                <RecommendedCard wine={heroWine} onOpen={setSelectedWine} />
              </div>
              <div className="self-end pb-4">
                <MobilePreview wine={heroWine} rankings={topWines} />
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
                <RankingCard key={wine.id} wine={wine} rank={index + 1} onOpen={setSelectedWine} />
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

        <section id="buzz-voice" className="border-b border-stone-200 bg-[#fbf8f3]">
          <div className="mx-auto grid max-w-[1720px] gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.64fr_0.36fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#8a001d]" />
                  <h2 className="text-xl font-black tracking-normal text-stone-950">Xで話題の投稿</h2>
                </div>
                <Link href="/wines" className="text-sm font-black text-stone-500 hover:text-[#8a001d]">もっと見る</Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {tweetWines.slice(0, 2).map((wine) => (
                  <TweetMiniCard key={wine.id} wine={wine} />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-stone-950">
                <Flame className="h-4 w-4 text-[#8a001d]" />
                ここで見つかるもの
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MetricBox label="掲載ワイン" value={`${stats.total}`} sub="本" tone="rose" />
                <MetricBox label="Xリンク" value={`${stats.tweets}`} sub="件" tone="gold" />
                <MetricBox label="平均価格" value={priceFmt(stats.avgPrice)} tone="green" />
                <MetricBox label="購入先" value={`${stats.stores}`} sub="店" tone="rose" />
              </div>
              <p className="mt-5 text-sm font-medium leading-7 text-stone-600">
                価格は目安です。最新の在庫と価格は各店舗で確認してください。
                話題の根拠は詳細ページのX投稿から確認できます。
              </p>
            </div>
          </div>
        </section>

        <HomeTweetStrip wines={homeWines} limit={5} />

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
              <div className="mt-4 grid gap-3 border-t border-stone-100 pt-4 md:grid-cols-4">
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
                    {homeAllStores.map((item) => (
                      <option key={item} value={item}>
                        {item}
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
                    {homeAllCountries.map((item) => (
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
                    <option value="all">すべて</option>
                    <option value="under1500">1,500円以下</option>
                    <option value="1500to2000">1,501〜2,000円</option>
                    <option value="over2000">2,001円以上</option>
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
            {(query || type !== "all" || store !== "all" || country !== "all" || priceFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setType("all");
                  setStore("all");
                  setCountry("all");
                  setPriceFilter("all");
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
                <GridWineCard key={wine.id} wine={wine} rank={index + 1} onOpen={setSelectedWine} />
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
            <a href="#buzz-voice" className="hover:text-stone-950">Xで話題</a>
          </div>
        </div>
      </footer>

      <QuickView wine={selectedWine} onClose={() => setSelectedWine(null)} />
      <ScrollToTop />
    </div>
  );
}
