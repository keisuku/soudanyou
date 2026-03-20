import Link from "next/link";
import { notFound } from "next/navigation";
import { mockWines } from "@/lib/mock-data";
import { BuzzBadge } from "@/components/wine/buzz-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Star, MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import { SnsPostCard } from "@/components/wine/sns-post-card";

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/wines"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        一覧に戻る
      </Link>

      <div className="mt-6 space-y-6">
        {/* Title */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">{wine.nameJa}</h1>
            <Badge variant="wine">{wineTypeLabels[wine.type]}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{wine.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {wine.producer} / {wine.country}
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">価格</p>
              <p className="text-xl font-bold text-primary">{formatPrice(wine.price)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Vivino</p>
              <p className="flex items-center justify-center gap-1 text-xl font-bold text-gold">
                <Star className="h-4 w-4 fill-gold" />
                {wine.vivinoScore?.toFixed(1) ?? "-"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">コスパ</p>
              <p className="text-xl font-bold text-foreground">{wine.costPerformance}/100</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">SNS話題度</p>
              <BuzzBadge score={wine.buzzScore} size="md" className="justify-center" />
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardContent className="p-5">
            <p className="text-muted-foreground">{wine.description}</p>
          </CardContent>
        </Card>

        {/* Grape varieties */}
        <div className="flex flex-wrap gap-2">
          {wine.grapeVarieties.map((grape) => (
            <Badge key={grape} variant="secondary">{grape}</Badge>
          ))}
          {wine.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        {/* Stores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              どこで買える？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedStores.map((store, i) => (
                <div
                  key={store.type}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    i === 0 ? "border-gold bg-gold/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="text-xs font-bold text-gold">最安</span>
                    )}
                    <span className="font-medium">{store.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${i === 0 ? "text-gold" : "text-foreground"}`}>
                      {formatPrice(store.price)}
                    </span>
                    <span className={`text-xs ${store.inStock ? "text-green-500" : "text-red-400"}`}>
                      {store.inStock ? "在庫あり" : "在庫なし"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* SNS Posts */}
        {wine.posts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                みんなの声（{wine.posts.length}件）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wine.posts.map((post) => (
                  <SnsPostCard key={post.id} post={post} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
