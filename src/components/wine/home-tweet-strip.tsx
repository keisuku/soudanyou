"use client";

import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import type { HomeWine } from "@/lib/home-data";
import { pickPrimaryTweetUrl } from "@/lib/tweets";
import { LazyTweetEmbed } from "./lazy-tweet-embed";

interface HomeTweetStripProps {
  wines: HomeWine[];
  limit?: number;
}

interface StripEntry {
  wine: HomeWine;
  tweetUrl: string;
}

function selectEntries(wines: HomeWine[], limit: number): StripEntry[] {
  const candidates = wines
    .filter((w) => w.raw.tweetUrls.length > 0)
    .slice()
    .sort((a, b) => {
      if (b.raw.buzzScore !== a.raw.buzzScore) return b.raw.buzzScore - a.raw.buzzScore;
      return b.raw.costPerformance - a.raw.costPerformance;
    });

  const entries: StripEntry[] = [];
  for (const wine of candidates) {
    const tweetUrl = pickPrimaryTweetUrl(wine.raw.tweetUrls);
    if (!tweetUrl) continue;
    entries.push({ wine, tweetUrl });
    if (entries.length >= limit) break;
  }
  return entries;
}

const priceFmt = (p: number) => "¥" + p.toLocaleString();

export function HomeTweetStrip({ wines, limit = 6 }: HomeTweetStripProps) {
  const entries = selectEntries(wines, limit);
  if (entries.length === 0) return null;

  return (
    <section
      aria-label="Xで話題のワイン"
      className="bg-white dark:bg-neutral-900 border-b border-[#f0ece8] dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}
          >
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-gray-100">
              いま、Xで話題の1本
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              リアルな飲み手の声。タップで詳細へ
            </p>
          </div>
        </div>

        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 [scrollbar-width:thin]"
          role="list"
        >
          {entries.map(({ wine, tweetUrl }) => (
            <article
              key={wine.id}
              role="listitem"
              className="snap-start shrink-0 w-[300px] md:w-[340px] rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden flex flex-col border border-[#f0ece8] dark:border-white/10"
            >
              <div className="p-3 bg-gray-50 dark:bg-white/5">
                <LazyTweetEmbed tweetUrl={tweetUrl} />
              </div>
              <Link
                href={`/wines/${wine.id}`}
                className="flex flex-col gap-2 p-4 border-t border-[#f0ece8] dark:border-white/10 hover:bg-rose-50/40 dark:hover:bg-rose-500/5 transition-colors"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                  {wine.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-black"
                    style={{ color: "#8B1A2B" }}
                  >
                    {priceFmt(wine.price)}
                  </span>
                  {wine.storeLabels[0] && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-md text-xs">
                      {wine.storeLabels[0]}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 dark:text-rose-300">
                  詳しく見る <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
