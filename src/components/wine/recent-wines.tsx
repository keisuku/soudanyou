"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { useRecent } from "@/lib/recent";
import { homeWines, homeTypeMap } from "@/lib/home-data";

export function RecentWines() {
  const { ids, count } = useRecent();
  if (count === 0) return null;
  const wines = ids
    .map((id) => homeWines.find((w) => w.id === id))
    .filter((w): w is NonNullable<typeof w> => !!w)
    .slice(0, 6);

  if (wines.length === 0) return null;

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-3xl p-5 md:p-6 shadow-sm border border-[#f0ece8] dark:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c5ce0, #9b7de8)" }}>
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">最近チェックしたワイン</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">もう一度見る？気になる1本が見つかるかも</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {wines.map((w) => {
          const ti = homeTypeMap[w.type];
          return (
            <Link
              key={w.id}
              href={`/wines/${w.id}`}
              className="group relative flex flex-col items-start gap-1 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors min-h-[84px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">{ti.icon}</span>
                <span className="text-[10px] font-bold" style={{ color: ti.color }}>{ti.label}</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                {w.name}
              </div>
              <div className="flex items-center gap-1 mt-auto text-[11px] font-black" style={{ color: "#8B1A2B" }}>
                ¥{w.price.toLocaleString()}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
