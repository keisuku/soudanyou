"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, X, ArrowRight } from "lucide-react";
import { useCompareList } from "@/lib/compare-list";
import { wines as allWines } from "@/lib/wines";

export function CompareTray() {
  const { ids, toggle, clear, count } = useCompareList();
  const pathname = usePathname() ?? "";

  // Hide on the /compare page itself to avoid confusion
  if (count === 0 || pathname === "/compare") return null;

  const list = ids
    .map((id) => allWines.find((w) => w.id === id))
    .filter((w): w is NonNullable<typeof w> => !!w);

  return (
    <div
      className="fixed bottom-20 md:bottom-5 left-4 md:left-5 z-30 flex flex-col gap-2 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-3 max-w-[calc(100vw-32px)] sm:max-w-sm"
      role="region"
      aria-label="比較リスト"
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-gold" />
        <span className="text-sm font-bold">比較リスト ({count}/3)</span>
        <button
          type="button"
          onClick={clear}
          className="ml-auto text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded-full hover:bg-muted transition-colors"
          aria-label="すべてクリア"
        >
          クリア
        </button>
      </div>
      <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
        {list.map((w) => (
          <div key={w.id} className="flex items-center gap-2 text-xs">
            <span className="flex-1 truncate text-foreground font-medium">{w.nameJa}</span>
            <button
              type="button"
              onClick={() => toggle(w.id)}
              aria-label="リストから外す"
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <Link
        href={`/compare?ids=${ids.join(",")}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-2 text-xs font-bold hover:bg-primary/90 transition-colors"
      >
        比較する <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
