"use client";

import Link from "next/link";
import { Heart, ArrowLeft, Trash2, Trophy } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { wines as allWines } from "@/lib/wines";
import { WineCard } from "@/components/wine/wine-card";
import { FavoriteButton } from "@/components/wine/favorite-button";

export default function FavoritesPage() {
  const { ids, clear, count } = useFavorites();
  const list = allWines.filter((w) => ids.has(w.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        ホームに戻る
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          お気に入り
          {count > 0 && (
            <span className="text-sm font-normal text-muted-foreground">({count}本)</span>
          )}
        </h1>
        {count > 0 && (
          <div className="flex items-center gap-2">
            {list.length >= 2 && (
              <Link
                href={`/compare?ids=${list.slice(0, 3).map((w) => w.id).join(",")}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/10 transition-colors min-h-[36px] px-3 py-1 rounded-full border border-primary/30"
              >
                <Trophy className="w-3 h-3" /> 比較 ({Math.min(list.length, 3)}本)
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                if (confirm("お気に入りをすべて削除しますか？")) clear();
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors min-h-[36px] px-3 py-1 rounded-full hover:bg-muted"
            >
              <Trash2 className="w-3 h-3" /> すべて削除
            </button>
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="inline-flex w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold text-foreground">まだお気に入りがありません</p>
          <p className="mt-2 text-sm text-muted-foreground">
            気になるワインに♡マークをつけて、あとでまとめてチェック！
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
            >
              ワインを探す
            </Link>
            <Link
              href="/wines"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted min-h-[44px]"
            >
              全ワイン一覧
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((wine) => (
            <div key={wine.id} className="relative">
              <WineCard wine={wine} />
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton wineId={wine.id} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
