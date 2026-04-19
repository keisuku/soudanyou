"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Utensils } from "lucide-react";
import { homeWines, homeTypeMap, type HomeWine } from "@/lib/home-data";
import { FavoriteButton } from "@/components/wine/favorite-button";

function dayIndex(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // deterministic hash across calendar days
  return (y * 1000 + m * 37 + d * 13) >>> 0;
}

function pickWineOfDay(list: HomeWine[], date: Date = new Date()): HomeWine | null {
  if (list.length === 0) return null;
  const top = [...list]
    .filter((w) => (w.vivino ?? 0) >= 3.5)
    .sort((a, b) => b.cospa - a.cospa)
    .slice(0, 20);
  const pool = top.length > 0 ? top : list;
  return pool[dayIndex(date) % pool.length];
}

export function WineOfTheDay() {
  const wine = useMemo(() => pickWineOfDay(homeWines), []);
  if (!wine) return null;
  const ti = homeTypeMap[wine.type];

  return (
    <section aria-labelledby="wod-heading" className="relative overflow-hidden rounded-3xl shadow-lg">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${ti.color}ee, ${ti.color}aa, #1A0A10)` }}
      />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)" }} />
      <div className="relative p-6 md:p-10 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <h2 id="wod-heading" className="text-sm font-bold uppercase tracking-[0.2em] text-amber-200">
            Wine of the Day
          </h2>
        </div>
        <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
          <div className="flex-shrink-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center text-7xl md:text-8xl shadow-2xl"
              style={{ backgroundColor: ti.bg, boxShadow: `0 20px 60px -20px ${ti.color}80` }}
            >
              {ti.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                {ti.label}ワイン
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                {wine.country}
              </span>
              {wine.vivino != null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/30 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-amber-200 text-amber-200" />
                  <span className="text-amber-50">{wine.vivino}</span>
                </span>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-2 leading-tight">{wine.name}</h3>
            <p className="text-sm md:text-base text-white/80 mb-4 leading-relaxed line-clamp-3">
              {wine.catch}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {wine.pairings.slice(0, 4).map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-xs text-white/90">
                  <Utensils className="w-3 h-3" />
                  {p}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-amber-200">¥{wine.price.toLocaleString()}</span>
                <span className="text-xs text-white/60">税込</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <FavoriteButton wineId={wine.id} size="sm" className="!bg-white/15 !text-white hover:!bg-white/25" />
                <Link
                  href={`/wines/${wine.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-amber-100 transition-colors min-h-[40px]"
                >
                  詳細を見る <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
