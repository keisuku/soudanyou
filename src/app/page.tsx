import { Flame, Wine, Sparkles, TrendingUp } from "lucide-react";
import { mockWines } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import type { WineType } from "@/types/wine";

const categories: { type: WineType; label: string; emoji: string; catch: string }[] = [
  { type: "red", label: "赤ワイン", emoji: "🍷", catch: "コンビニ赤ならこれ！" },
  { type: "white", label: "白ワイン", emoji: "🥂", catch: "白ならこれ！" },
  { type: "sparkling", label: "スパークリング", emoji: "🍾", catch: "泡ならこれ！" },
  { type: "rose", label: "ロゼ", emoji: "🌸", catch: "ロゼならこれ！" },
];

function getTopByBuzz(type: WineType, limit = 3) {
  return mockWines
    .filter((w) => w.type === type)
    .sort((a, b) => b.buzzScore - a.buzzScore)
    .slice(0, limit);
}

const buzzRanking = [...mockWines]
  .sort((a, b) => b.buzzScore - a.buzzScore)
  .slice(0, 5);

const cospaRanking = [...mockWines]
  .sort((a, b) => b.costPerformance - a.costPerformance)
  .slice(0, 5);

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-12 text-center sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          今買うべきワインが
          <br />
          <span className="text-gold">すぐわかる</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          コンビニ・スーパーで買えるワインをSNS話題度とコスパで厳選。
          <br />
          あなたの「今日の一本」がここにあります。
        </p>
      </section>

      {/* SNS話題度ランキング */}
      <section>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          <h2 className="text-2xl font-bold text-foreground">SNS話題度ランキング</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          今、SNSで最も話題のワインTOP5
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {buzzRanking.map((wine, i) => (
            <WineCard key={wine.id} wine={wine} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* カテゴリ別 今買うべきワイン */}
      {categories.map((cat) => {
        const wines = getTopByBuzz(cat.type);
        if (wines.length === 0) return null;
        return (
          <section key={cat.type} className="mt-14">
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat.emoji}</span>
              <h2 className="text-2xl font-bold text-foreground">{cat.catch}</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {cat.label}のSNS話題度TOP3
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wines.map((wine, i) => (
                <WineCard key={wine.id} wine={wine} rank={i + 1} />
              ))}
            </div>
          </section>
        );
      })}

      {/* コスパ最強ランキング */}
      <section className="mt-14 pb-16">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold" />
          <h2 className="text-2xl font-bold text-foreground">コスパ最強ランキング</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          評価が高いのに安い！お値打ちワインTOP5
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cospaRanking.map((wine, i) => (
            <WineCard key={wine.id} wine={wine} rank={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
