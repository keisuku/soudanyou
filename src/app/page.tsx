import { Search, Star, TrendingUp, Globe } from "lucide-react";
import { mockWines, mockTrends, mockTweets } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import { TrendList } from "@/components/trends/trend-list";
import { TweetCard } from "@/components/trends/tweet-card";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "価格比較",
    description:
      "楽天、Amazon、エノテカなど複数サイトの価格を一括比較。最安値を見逃しません。",
  },
  {
    icon: Star,
    title: "世界の評価",
    description:
      "Vivino、Wine Searcher、CellarTrackerの評価を集約。信頼できるスコアで選べます。",
  },
  {
    icon: TrendingUp,
    title: "トレンド",
    description:
      "SNSやメディアで話題のワインをリアルタイムで追跡。トレンドを先取りしましょう。",
  },
];

export default function Home() {
  const latestWines = mockWines.slice(0, 4);
  const latestTweets = mockTweets.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-16 text-center sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          あなたのワイン体験を、
          <br className="sm:hidden" />
          もっと豊かに
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          価格比較、世界中の評価、最新トレンドを一箇所に集約。
          <br />
          あなたにぴったりの一本を見つけましょう。
        </p>
      </section>

      {/* Feature cards */}
      <section className="grid gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="text-center">
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Latest trending wines */}
      <section className="mt-16">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gold" />
          <h2 className="text-2xl font-bold text-foreground">注目のワイン</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latestWines.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </section>

      {/* Trending topics */}
      <section className="mt-16">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold" />
          <h2 className="text-2xl font-bold text-foreground">トレンドトピック</h2>
        </div>
        <div className="mt-6">
          <TrendList trends={mockTrends} />
        </div>
      </section>

      {/* Recent tweets */}
      <section className="mt-16 pb-16">
        <h2 className="text-2xl font-bold text-foreground">最近の話題</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </section>
    </div>
  );
}
