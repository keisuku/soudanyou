"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star, X, Trophy, Wine as WineIcon } from "lucide-react";
import { wines as allWines } from "@/lib/wines";
import { countryJa } from "@/lib/home-data";
import { formatPrice } from "@/lib/utils";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-border">
      <th className="py-3 pr-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap align-top">
        {label}
      </th>
      {children}
    </tr>
  );
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const list = ids
    .map((id) => allWines.find((w) => w.id === id))
    .filter((w): w is NonNullable<typeof w> => !!w);

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> ホーム
        </Link>
        <h1 className="mt-4 text-2xl font-bold">ワイン比較</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          比較するワインを選択してください。URLパラメータ <code className="px-1 py-0.5 rounded bg-muted">?ids=ワインID1,ワインID2</code> の形式で最大3本まで指定できます。
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/wines" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 min-h-[44px]">
            ワイン一覧へ
          </Link>
          <Link href="/favorites" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted min-h-[44px]">
            お気に入りから選ぶ
          </Link>
        </div>
      </div>
    );
  }

  const remove = (id: string) => {
    const next = list.filter((w) => w.id !== id).map((w) => w.id).join(",");
    const url = next ? `/compare?ids=${next}` : "/compare";
    router.push(url);
  };

  // compute winners
  const lowestPrice = Math.min(...list.map((w) => w.price));
  const highestVivino = Math.max(...list.map((w) => w.vivinoScore ?? 0));
  const highestCospa = Math.max(...list.map((w) => w.costPerformance));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> ホーム
      </Link>
      <h1 className="mt-4 text-2xl font-bold flex items-center gap-2">
        <Trophy className="w-6 h-6 text-gold" />
        ワイン比較 <span className="text-sm font-normal text-muted-foreground">({list.length}本)</span>
      </h1>

      {/* Header cards */}
      <div
        className="mt-6 grid gap-3"
        style={{ gridTemplateColumns: `8rem repeat(${list.length}, minmax(0, 1fr))` }}
      >
        <div></div>
        {list.map((w) => (
          <div key={w.id} className="relative rounded-2xl border border-border bg-card p-4">
            <button
              type="button"
              onClick={() => remove(w.id)}
              aria-label="比較から外す"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <Link href={`/wines/${w.id}`} className="block">
              <div className="text-xs text-muted-foreground mb-1">{countryJa(w.country)}</div>
              <h3 className="text-base font-bold leading-tight mb-2">{w.nameJa}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{w.whyBuyNow}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[480px] text-sm">
          <tbody>
            <Row label="価格">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">
                  <div className={`font-black text-lg ${w.price === lowestPrice ? "text-primary" : ""}`}>
                    {formatPrice(w.price)}
                    {w.price === lowestPrice && list.length > 1 && (
                      <span className="ml-2 text-[10px] rounded-full bg-primary/10 px-2 py-0.5 text-primary align-middle">最安</span>
                    )}
                  </div>
                </td>
              ))}
            </Row>
            <Row label="Vivino">
              {list.map((w) => {
                const v = w.vivinoScore ?? 0;
                return (
                  <td key={w.id} className="py-3 px-3 align-top">
                    {w.vivinoScore != null ? (
                      <div className={`flex items-center gap-1 font-bold ${v === highestVivino ? "text-gold" : ""}`}>
                        <Star className={`w-4 h-4 ${v === highestVivino ? "fill-gold" : ""}`} />
                        {w.vivinoScore.toFixed(1)}
                        {v === highestVivino && list.length > 1 && (
                          <span className="ml-1 text-[10px] rounded-full bg-gold/10 px-2 py-0.5 text-gold">最高</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                );
              })}
            </Row>
            <Row label="コスパ">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">
                  <div className={`font-bold ${w.costPerformance === highestCospa ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                    {w.costPerformance}
                    <span className="text-xs text-muted-foreground">/100</span>
                    {w.costPerformance === highestCospa && list.length > 1 && (
                      <span className="ml-2 text-[10px] rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400 align-middle">最強</span>
                    )}
                  </div>
                </td>
              ))}
            </Row>
            <Row label="タイプ">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs">
                    <WineIcon className="w-3 h-3" />
                    {w.type}
                  </span>
                </td>
              ))}
            </Row>
            <Row label="度数">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">{w.abv}%</td>
              ))}
            </Row>
            <Row label="飲み頃温度">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top text-xs">{w.servingTemp}</td>
              ))}
            </Row>
            <Row label="産地">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top text-xs">
                  {countryJa(w.country)}{w.region ? ` / ${w.region}` : ""}
                </td>
              ))}
            </Row>
            <Row label="品種">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">
                  <div className="flex flex-wrap gap-1">
                    {w.grapeVarieties.map((g) => (
                      <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{g}</span>
                    ))}
                  </div>
                </td>
              ))}
            </Row>
            <Row label="合う料理">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">
                  <div className="flex flex-wrap gap-1">
                    {w.pairings.map((p) => (
                      <span key={p} className="rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 px-2 py-0.5 text-[11px]">{p}</span>
                    ))}
                  </div>
                </td>
              ))}
            </Row>
            <Row label="買える店">
              {list.map((w) => (
                <td key={w.id} className="py-3 px-3 align-top">
                  <div className="flex flex-wrap gap-1">
                    {w.stores.map((s) => (
                      <span key={s.type} className="rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[11px]">{s.name}</span>
                    ))}
                  </div>
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/wines" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted min-h-[44px]">
          別のワインを追加
        </Link>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-8">読み込み中...</div>}>
      <CompareContent />
    </Suspense>
  );
}
