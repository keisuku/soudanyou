import Link from "next/link";
import { notFound } from "next/navigation";
import { mockRegions, mockWines } from "@/lib/mock-data";
import { WineCard } from "@/components/wine/wine-card";
import { Badge } from "@/components/ui/badge";

const countryFlags: Record<string, string> = {
  FR: "\u{1F1EB}\u{1F1F7}",
  IT: "\u{1F1EE}\u{1F1F9}",
  US: "\u{1F1FA}\u{1F1F8}",
  JP: "\u{1F1EF}\u{1F1F5}",
  NZ: "\u{1F1F3}\u{1F1FF}",
  AU: "\u{1F1E6}\u{1F1FA}",
  ES: "\u{1F1EA}\u{1F1F8}",
};

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = mockRegions.find((r) => r.slug === slug);

  if (!region) {
    notFound();
  }

  const regionWines = mockWines.filter(
    (wine) => wine.country === region.country
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/regions"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        &larr; 産地一覧に戻る
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">
            {countryFlags[region.countryCode] || ""}
          </span>
          <h1 className="text-3xl font-bold">{region.nameJa}</h1>
          <Badge variant="secondary">{region.country}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">{region.name}</p>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          {region.description}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        この産地のワイン ({regionWines.length} 件)
      </h2>

      {regionWines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionWines.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-8 text-center">
          この産地に該当するワインはまだ登録されていません。
        </p>
      )}
    </div>
  );
}
