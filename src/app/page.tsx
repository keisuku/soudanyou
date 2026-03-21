import { mockWines } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import type { WineType } from "@/types/wine";

const typeNav: { type: WineType; label: string; id: string }[] = [
  { type: "red", label: "🍷 赤", id: "red" },
  { type: "white", label: "🥂 白", id: "white" },
  { type: "sparkling", label: "🍾 泡", id: "sparkling" },
  { type: "rose", label: "🌸 ロゼ", id: "rose" },
];

const budgetNav = [
  { label: "〜1,000円", id: "budget-1000", max: 1000 },
  { label: "〜2,000円", id: "budget-2000", max: 2000 },
  { label: "2,000円〜", id: "budget-over", max: 99999 },
];

function getWines(type: WineType) {
  return mockWines
    .filter((w) => w.type === type)
    .sort((a, b) => b.costPerformance - a.costPerformance);
}

const topPick = [...mockWines].sort((a, b) => b.buzzScore - a.buzzScore)[0];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Hero + Top Pick */}
      <section className="py-10 sm:py-14">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          今買うべきワインが<span className="text-primary">すぐわかる</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          コンビニ・スーパーの手頃なワインをコスパと話題度で厳選
        </p>

        {/* Featured pick */}
        <div className="mt-6 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            今週のイチオシ
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground">{topPick.nameJa}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{topPick.whyBuyNow}</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(topPick.price)}
            </span>
            <a
              href={`/soudanyou/wines/${topPick.id}`}
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              詳しく見る
            </a>
          </div>
        </div>
      </section>

      {/* Category nav */}
      <nav className="sticky top-16 z-40 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto">
          {typeNav.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t.label}
            </a>
          ))}
          <span className="mx-1 self-center text-border">|</span>
          {budgetNav.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {b.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Wine sections by type */}
      {typeNav.map((cat) => {
        const wines = getWines(cat.type);
        if (wines.length === 0) return null;
        return (
          <section key={cat.type} id={cat.id} className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-bold text-foreground">
              {cat.label}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wines.map((wine, i) => (
                <WineCard key={wine.id} wine={wine} rank={i + 1} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Budget sections */}
      <section id="budget-1000" className="mt-12 scroll-mt-28">
        <h2 className="text-xl font-bold text-foreground">〜1,000円のベスト</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockWines
            .filter((w) => w.price <= 1000)
            .sort((a, b) => b.costPerformance - a.costPerformance)
            .map((wine, i) => (
              <WineCard key={wine.id} wine={wine} rank={i + 1} />
            ))}
        </div>
      </section>

      <section id="budget-2000" className="mt-12 scroll-mt-28">
        <h2 className="text-xl font-bold text-foreground">1,000〜2,000円のベスト</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockWines
            .filter((w) => w.price > 1000 && w.price <= 2000)
            .sort((a, b) => b.costPerformance - a.costPerformance)
            .map((wine, i) => (
              <WineCard key={wine.id} wine={wine} rank={i + 1} />
            ))}
        </div>
      </section>

      <section id="budget-over" className="mt-12 scroll-mt-28 pb-16">
        <h2 className="text-xl font-bold text-foreground">2,000円〜 ちょっと贅沢</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockWines
            .filter((w) => w.price > 2000)
            .sort((a, b) => b.costPerformance - a.costPerformance)
            .map((wine, i) => (
              <WineCard key={wine.id} wine={wine} rank={i + 1} />
            ))}
        </div>
      </section>
    </div>
  );
}
