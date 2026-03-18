"use client";

import Link from "next/link";
import { mockRegions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ContinentGroup {
  name: string;
  countries: string[];
}

const continents: ContinentGroup[] = [
  {
    name: "\u30E8\u30FC\u30ED\u30C3\u30D1",
    countries: ["France", "Italy", "Spain"],
  },
  {
    name: "\u30A2\u30B8\u30A2\u30FB\u30AA\u30BB\u30A2\u30CB\u30A2",
    countries: ["Japan", "Australia", "New Zealand"],
  },
  {
    name: "\u30A2\u30E1\u30EA\u30AB",
    countries: ["USA"],
  },
];

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">ワイン産地マップ</h1>
      <p className="text-muted-foreground mb-2">
        世界のワイン産地を地域別に探索
      </p>
      <Badge variant="secondary" className="mb-8">
        インタラクティブマップは準備中です
      </Badge>

      <div className="space-y-10">
        {continents.map((continent) => {
          const regions = mockRegions.filter((r) =>
            continent.countries.includes(r.country)
          );

          if (regions.length === 0) return null;

          return (
            <section key={continent.name}>
              <h2 className="text-2xl font-semibold mb-4">{continent.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regions.map((region) => (
                  <Link key={region.slug} href={`/regions/${region.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {countryFlags[region.countryCode] || ""}
                          </span>
                          <CardTitle className="text-base">
                            {region.nameJa}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          {region.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {region.wineCount} 銘柄
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {region.coordinates[0].toFixed(2)},{" "}
                            {region.coordinates[1].toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
