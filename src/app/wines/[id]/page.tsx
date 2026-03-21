import Link from "next/link";
import { notFound } from "next/navigation";
import { mockWines } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  Star, MapPin, ArrowLeft, Thermometer, Wine,
  UtensilsCrossed, ShoppingCart, ExternalLink, MessageCircle,
} from "lucide-react";
import { TweetEmbed } from "@/components/wine/tweet-embed";

export function generateStaticParams() {
  return mockWines.map((wine) => ({ id: wine.id }));
}

const wineTypeLabels: Record<string, string> = {
  red: "赤ワイン",
  white: "白ワイン",
  rose: "ロゼ",
  sparkling: "スパークリング",
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

  const sortedStores = [...wine.stores].sort((a, b) => a.price - b.price);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/wines"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        一覧に戻る
      </Link>

      <div className="mt-6 space-y-6">
        {/* Hero */}
        <div>
          <Badge variant="wine">{wineTypeLabels[wine.type]}</Badge>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{wine.nameJa}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wine.name} — {wine.producer} / {wine.country}
          </p>
          <p className="mt-3 text-lg font-medium text-primary">{wine.whyBuyNow}</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">価格</p>
              <p className="text-xl font-bold text-primary">{formatPrice(wine.price)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Vivino</p>
              <p className="flex items-center justify-center gap-1 text-xl font-bold text-gold">
                <Star className="h-4 w-4 fill-gold" />
                {wine.vivinoScore?.toFixed(1) ?? "-"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">コスパ</p>
              <p className="text-xl font-bold">{wine.costPerformance}<span className="text-sm text-muted-foreground">/100</span></p>
            </CardContent>
          </Card>
        </div>

        {/* About this wine */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <p className="text-muted-foreground">{wine.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Wine className="h-4 w-4 text-muted-foreground" />
                <span>度数 {wine.abv}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span>{wine.servingTemp}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {wine.grapeVarieties.map((g) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Food pairing */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <UtensilsCrossed className="h-4 w-4" />
              合う料理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {wine.pairings.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Where to buy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              どこで買える？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedStores.map((store, i) => (
                <div
                  key={store.type}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    i === 0 ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="text-xs font-bold text-primary">最安</span>}
                    <span className="font-medium">{store.name}</span>
                  </div>
                  <span className={`font-bold ${i === 0 ? "text-primary" : ""}`}>
                    {formatPrice(store.price)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buy links */}
        {wine.buyLinks.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-4 w-4" />
                オンラインで買う
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {wine.buyLinks.map((link) => (
                  <a
                    key={link.store}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {link.store}で検索
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tweets - only shown if URLs exist */}
        {wine.tweetUrls.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-4 w-4" />
                みんなの声
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wine.tweetUrls.map((url) => (
                  <TweetEmbed key={url} tweetUrl={url} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
