import Link from "next/link";
import { notFound } from "next/navigation";
import { mockWines, mockTweets } from "@/lib/mock-data";
import { RatingBadge } from "@/components/wine/rating-badge";
import { PriceComparison } from "@/components/wine/price-comparison";
import { PriceChart } from "@/components/wine/price-chart";
import { TweetCard } from "@/components/trends/tweet-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const wineTypeLabels: Record<string, string> = {
  red: "赤ワイン",
  white: "白ワイン",
  rose: "ロゼ",
  sparkling: "スパークリング",
  dessert: "デザートワイン",
};

const wineTypeColors: Record<string, string> = {
  red: "bg-red-100 text-red-800",
  white: "bg-yellow-100 text-yellow-800",
  rose: "bg-pink-100 text-pink-800",
  sparkling: "bg-amber-100 text-amber-800",
  dessert: "bg-orange-100 text-orange-800",
};

export default async function WineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wine = mockWines.find((w) => w.id === id);

  if (!wine) {
    notFound();
  }

  // Find related tweets by checking if tweet content or wineRelated keywords match
  const relatedTweets = mockTweets.filter((tweet) => {
    const contentLower = tweet.content.toLowerCase();
    const nameLower = wine.name.toLowerCase();
    const nameJa = wine.nameJa;

    return (
      contentLower.includes(nameLower) ||
      tweet.content.includes(nameJa) ||
      tweet.wineRelated.some(
        (keyword) =>
          wine.nameJa.includes(keyword) ||
          wine.name.toLowerCase().includes(keyword.toLowerCase()) ||
          wine.region.includes(keyword) ||
          wine.grapeVarieties.some((g) => g.includes(keyword))
      )
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/wines"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        &larr; ワイン一覧に戻る
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{wine.nameJa}</h1>
              <Badge className={wineTypeColors[wine.type]}>
                {wineTypeLabels[wine.type]}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{wine.name}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              {wine.vintage && <span>ヴィンテージ: {wine.vintage}</span>}
              <span>産地: {wine.region}</span>
              <span>生産者: {wine.producer}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>説明</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{wine.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ぶどう品種</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {wine.grapeVarieties.map((grape) => (
                  <Badge key={grape} variant="secondary">
                    {grape}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>評価</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RatingBadge
                  source="Vivino"
                  score={wine.ratings.vivino}
                  maxScore={5}
                />
                <RatingBadge
                  source="Wine Searcher"
                  score={wine.ratings.wineSearcher}
                  maxScore={100}
                />
                <RatingBadge
                  source="CellarTracker"
                  score={wine.ratings.cellarTracker}
                  maxScore={100}
                />
              </div>
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle>価格推移</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart priceHistory={wine.priceHistory} />
            </CardContent>
          </Card>

          {/* Related Tweets */}
          {relatedTweets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>関連ツイート</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedTweets.map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Price Comparison */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>価格比較</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceComparison prices={wine.prices} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
