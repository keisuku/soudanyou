import { Flame, TrendingUp } from "lucide-react";
import { mockWines, storeRecommendedTweets } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import { StoreTweets } from "@/components/wine/store-tweets";
import type { WineType } from "@/types/wine";

const categories: { type: WineType; label: string; emoji: string; catch: string; id: string }[] = [
  { type: "red", label: "赤ワイン", emoji: "🍷", catch: "赤ならこれ！", id: "red" },
  { type: "white", label: "白ワイン", emoji: "🥂", catch: "白ならこれ！", id: "white" },
  { type: "sparkling", label: "スパークリング", emoji: "🍾", catch: "泡ならこれ！", id: "sparkling" },
  { type: "rose", label: "ロゼ", emoji: "🌸", catch: "ロゼならこれ！", id: "rose" },
];

const storeGroups = [
  {
    label: "コンビニ",
    id: "convenience",
    stores: [
      { type: "seven", label: "セブン" },
      { type: "lawson", label: "ローソン" },
      { type: "familymart", label: "ファミマ" },
    ],
  },
  {
    label: "スーパー",
    id: "super",
    stores: [
      { type: "aeon", label: "イオン" },
      { type: "seijoishii", label: "成城石井" },
      { type: "costco", label: "コストコ" },
    ],
  },
  {
    label: "専門店",
    id: "specialty",
    stores: [
      { type: "kaldi", label: "カルディ" },
      { type: "donki", label: "ドンキ" },
      { type: "liquor_shop", label: "酒屋" },
    ],
  },
];

const menuItems = [
  { href: "#sns", label: "🔥 SNS話題" },
  { href: "#red", label: "🍷 赤" },
  { href: "#white", label: "🥂 白" },
  { href: "#sparkling", label: "🍾 泡" },
  { href: "#rose", label: "🌸 ロゼ" },
  { href: "#convenience", label: "🏪 コンビニ" },
  { href: "#super", label: "🛒 スーパー" },
  { href: "#specialty", label: "🍶 専門店" },
  { href: "#cospa", label: "💰 コスパ" },
];

function getTopByBuzz(type: WineType, limit = 3) {
  return mockWines
    .filter((w) => w.type === type)
    .sort((a, b) => b.buzzScore - a.buzzScore)
    .slice(0, limit);
}

function getWinesByStore(storeType: string) {
  return mockWines
    .filter((w) => w.stores.some((s) => s.type === storeType))
    .sort((a, b) => b.buzzScore - a.buzzScore)
    .slice(0, 3);
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
      <section className="py-10 text-center sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          今買うべきワインが
          <br />
          <span className="text-primary">すぐわかる</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          コンビニ・スーパーで買えるワインをSNS話題度とコスパで厳選
        </p>
      </section>

      {/* Quick nav menu */}
      <nav className="sticky top-16 z-40 -mx-4 overflow-x-auto border-b border-border bg-card/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 whitespace-nowrap">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* SNS話題度ランキング */}
      <section id="sns" className="mt-8 scroll-mt-28">
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

      {/* カテゴリ別 */}
      {categories.map((cat) => {
        const wines = getTopByBuzz(cat.type);
        if (wines.length === 0) return null;
        return (
          <section key={cat.type} id={cat.id} className="mt-12 scroll-mt-28">
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

      {/* 店舗別セクション */}
      {storeGroups.map((group) => (
        <section key={group.id} id={group.id} className="mt-12 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">
            {group.label}で買うなら
          </h2>
          {group.stores.map((store) => {
            const wines = getWinesByStore(store.type);
            if (wines.length === 0) return null;
            return (
              <div key={store.type} className="mt-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {store.label}
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {wines.map((wine) => (
                    <WineCard key={wine.id} wine={wine} />
                  ))}
                </div>
                {storeRecommendedTweets[store.type] && (
                  <StoreTweets
                    storeName={store.label}
                    tweetUrls={storeRecommendedTweets[store.type]}
                  />
                )}
              </div>
            );
          })}
        </section>
      ))}

      {/* コスパ最強ランキング */}
      <section id="cospa" className="mt-12 scroll-mt-28 pb-16">
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
