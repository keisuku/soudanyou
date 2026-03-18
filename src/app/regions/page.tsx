import Link from "next/link";
import { mockRegions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const countryFlags: Record<string, string> = {
  FR: "\u{1F1EB}\u{1F1F7}",
  IT: "\u{1F1EE}\u{1F1F9}",
  US: "\u{1F1FA}\u{1F1F8}",
  JP: "\u{1F1EF}\u{1F1F5}",
  NZ: "\u{1F1F3}\u{1F1FF}",
  AU: "\u{1F1E6}\u{1F1FA}",
  ES: "\u{1F1EA}\u{1F1F8}",
};

export default function RegionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">ワイン産地</h1>
      <p className="text-muted-foreground mb-8">
        世界各地のワイン産地を探索しましょう
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRegions.map((region) => (
          <Link key={region.slug} href={`/regions/${region.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {countryFlags[region.countryCode] || ""}
                  </span>
                  <CardTitle>{region.nameJa}</CardTitle>
                </div>
                <CardDescription>{region.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {region.description}
                </p>
                <p className="text-sm font-medium">
                  {region.wineCount} 銘柄
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
