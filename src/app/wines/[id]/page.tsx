import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wines as allWines } from "@/lib/wines";
import { countryJa } from "@/lib/home-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WineCard } from "@/components/wine/wine-card";
import { formatPrice } from "@/lib/utils";
import {
  Star, MapPin, ArrowLeft, Thermometer, Wine,
  UtensilsCrossed, ShoppingCart, ExternalLink, MessageCircle,
  ChevronRight, Grape, Sparkles,
} from "lucide-react";
import { TweetEmbed } from "@/components/wine/tweet-embed";
import { FavoriteButton } from "@/components/wine/favorite-button";
import { ShareButton } from "@/components/wine/share-button";
import { RecentTracker } from "@/components/wine/recent-tracker";
import { CompareButton } from "@/components/wine/compare-button";
import type { Wine as WineType } from "@/types/wine";

export function generateStaticParams() {
  return allWines.map((wine) => ({ id: wine.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const wine = allWines.find((w) => w.id === id);
  if (!wine) return { title: "ワインが見つかりません" };
  const title = `${wine.nameJa} ${formatPrice(wine.price)} | ご近所バズワイン`;
  const description = wine.whyBuyNow;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const wineTypeLabels: Record<string, string> = {
  red: "赤ワイン",
  white: "白ワイン",
  rose: "ロゼ",
  sparkling: "スパークリング",
};

function similarWines(current: WineType, n: number = 6): WineType[] {
  const priceRange = current.price * 0.4;
  const candidates = allWines.filter((w) => w.id !== current.id);
  return candidates
    .map((w) => {
      let score = 0;
      if (w.type === current.type) score += 50;
      if (w.country === current.country) score += 20;
      if (Math.abs(w.price - current.price) < priceRange) score += 15;
      const sharedGrapes = w.grapeVarieties.filter((g) =>
        current.grapeVarieties.includes(g)
      ).length;
      score += sharedGrapes * 8;
      const sharedPairings = w.pairings.filter((p) =>
        current.pairings.includes(p)
      ).length;
      score += sharedPairings * 5;
      score += w.costPerformance * 0.1;
      return { wine: w, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.wine);
}

export default async function WineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wine = allWines.find((w) => w.id === id);

  if (!wine) {
    notFound();
  }

  const sortedStores = [...wine.stores].sort((a, b) => a.price - b.price);
  const related = similarWines(wine);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <RecentTracker wineId={wine.id} />
      {/* Breadcrumb */}
      <nav aria-label="パンくずリスト" className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">ホーム</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/wines" className="hover:text-foreground">全ワイン</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{wine.nameJa}</span>
      </nav>

      <Link
        href="/wines"
        className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        一覧に戻る
      </Link>

      <div className="mt-6 space-y-6">
        {/* Hero */}
        <div className="relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <FavoriteButton wineId={wine.id} />
          </div>
          <div className="flex flex-wrap items-center gap-2 pr-12">
            <Badge variant="wine">{wineTypeLabels[wine.type]}</Badge>
            <Link
              href={`/wines?country=${encodeURIComponent(wine.country)}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {countryJa(wine.country)}
              {wine.region && ` / ${wine.region}`}
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl pr-12">{wine.nameJa}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wine.name} — {wine.producer}
          </p>
          <p className="mt-3 text-lg font-medium text-primary">{wine.whyBuyNow}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ShareButton
              title={`${wine.nameJa} | ご近所バズワイン`}
              text={wine.whyBuyNow}
            />
            <CompareButton wineId={wine.id} />
          </div>
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
            <p className="text-muted-foreground whitespace-pre-line">{wine.description}</p>

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

            <div className="flex flex-wrap items-center gap-1.5">
              <Grape className="h-4 w-4 text-muted-foreground" />
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
                <Link
                  key={p}
                  href={`/wines?pairing=${encodeURIComponent(p)}`}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {p}
                </Link>
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
                <Link
                  key={store.type}
                  href={`/wines?store=${store.type}`}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted ${
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
                </Link>
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
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
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
                {[...wine.tweetUrls]
                  .sort((a, b) => {
                    const aPin = a.includes("/winenomuhito/") ? 0 : 1;
                    const bPin = b.includes("/winenomuhito/") ? 0 : 1;
                    return aPin - bPin;
                  })
                  .map((url) => (
                    <TweetEmbed key={url} tweetUrl={url} />
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: wine.nameJa,
              alternateName: wine.name,
              description: wine.description,
              brand: { "@type": "Brand", name: wine.producer },
              countryOfOrigin: wine.country,
              category: "Wine",
              ...(wine.vivinoScore && {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: wine.vivinoScore,
                  bestRating: 5,
                  worstRating: 1,
                  ratingCount: 1,
                },
              }),
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "JPY",
                lowPrice: Math.min(...wine.stores.map((s) => s.price)),
                highPrice: Math.max(...wine.stores.map((s) => s.price)),
                offerCount: wine.stores.length,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />

        {/* Related wines */}
        {related.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                このワインに似たおすすめ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {related.slice(0, 4).map((w) => (
                  <WineCard key={w.id} wine={w} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
