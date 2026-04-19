import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ご近所ワイン",
    short_name: "ご近所ワイン",
    description:
      "コンビニ・スーパーで買えるワインをコスパと話題度で厳選。",
    start_url: "/soudanyou",
    scope: "/soudanyou",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FDFAF6",
    theme_color: "#8B1A2B",
    lang: "ja",
    categories: ["food", "lifestyle", "shopping"],
    icons: [
      {
        src: "/soudanyou/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/soudanyou/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/soudanyou/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
