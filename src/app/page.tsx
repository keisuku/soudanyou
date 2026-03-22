import Link from "next/link";
import { wines as allWines } from "@/lib/wines";
import { WineCard } from "@/components/wine/wine-card";
import type { WineType } from "@/types/wine";
import { Card, CardContent } from "@/components/ui/card";

const typeNav: { type: WineType; label: string; emoji: string; id: string }[] = [
  { type: "red", label: "赤ワイン", emoji: "🍷", id: "red" },
  { type: "white", label: "白ワイン", emoji: "🥂", id: "white" },
  { type: "sparkling", label: "スパークリング", emoji: "🍾", id: "sparkling" },
  { type: "rose", label: "ロゼ", emoji: "🌸", id: "rose" },
];

function getWines(type: WineType) {
  return allWines
    .filter((w) => w.type === type)
    .sort((a, b) => b.costPerformance - a.costPerformance);
}

const topPick = [...allWines].sort((a, b) => b.buzzScore - a.buzzScore)[0];

const faqs = [
  {
    q: "Vivinoスコアって何？",
    a: "世界最大のワインアプリVivino（利用者6,300万人）のユーザー評価。5点満点で3.5以上あれば十分美味しいワインです。",
  },
  {
    q: "コンビニワインって美味しいの？",
    a: "最近のコンビニワインは品質が大幅に向上。特にチリ産カベルネやスペイン産カヴァは、専門店と遜色ない味わいが楽しめます。",
  },
  {
    q: "赤と白、どっちを選ぶ？",
    a: "肉料理やトマト系なら赤、魚・和食・サラダなら白がおすすめ。迷ったらスパークリングが万能です。",
  },
  {
    q: "コスパ指標って何？",
    a: "Vivinoスコアと価格のバランスを100点満点で表した独自指標。高いほど「評価の割にお得」なワインです。",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-10 sm:py-14">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          今買うべきワインが<span className="text-primary">すぐわかる</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          コンビニ・スーパーで手に入る{allWines.length}本を厳選。コスパと話題度でランキング。
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
            <Link
              href={`/wines/${topPick.id}`}
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              詳しく見る
            </Link>
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
              {t.emoji} {t.label}
            </a>
          ))}
          <a
            href="#guide"
            className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            📖 選び方ガイド
          </a>
        </div>
      </nav>

      {/* Wine sections by type */}
      {typeNav.map((cat) => {
        const typeWines = getWines(cat.type);
        if (typeWines.length === 0) return null;
        return (
          <section key={cat.type} id={cat.id} className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-bold text-foreground">
              {cat.emoji} {cat.label}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              コスパ順で{typeWines.length}本
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typeWines.map((wine, i) => (
                <WineCard key={wine.id} wine={wine} rank={i + 1} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Guide section */}
      <section id="guide" className="mt-14 scroll-mt-28 pb-16">
        <h2 className="text-xl font-bold text-foreground">📖 ワイン選びガイド</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
