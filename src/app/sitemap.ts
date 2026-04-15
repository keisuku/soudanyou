import type { MetadataRoute } from "next";
import wineData from "@/lib/__generated__/wines.json";
import type { Wine } from "@/types/wine";

const wines = wineData as unknown as Wine[];
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keisuku.github.io/soudanyou";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/wines`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
  const winePages: MetadataRoute.Sitemap = wines.map((w) => ({
    url: `${BASE_URL}/wines/${w.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticPages, ...winePages];
}
