import { ImageResponse } from "next/og";
import { wines as allWines } from "@/lib/wines";

export const dynamic = "force-static";

export const alt = "ご近所ワイン 詳細";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return allWines.map((w) => ({ id: w.id }));
}

const typeIcon: Record<string, string> = {
  red: "🍷",
  white: "🥂",
  sparkling: "🍾",
  rose: "🌸",
};

const typeLabel: Record<string, string> = {
  red: "赤ワイン",
  white: "白ワイン",
  sparkling: "スパークリング",
  rose: "ロゼ",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wine = allWines.find((w) => w.id === id);
  if (!wine) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#1A0A10", color: "white", fontSize: 60 }}>
          ご近所ワイン
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1A0A10 0%, #3D1225 100%)",
          color: "white",
          padding: 60,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 80% 30%, #8B1A2B 0%, transparent 60%)",
            opacity: 0.4,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: "#D4A853", fontWeight: 700 }}>
          <span>🍷</span>
          <span>ご近所ワイン</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40, flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36 }}>
            <span style={{ fontSize: 120 }}>{typeIcon[wine.type]}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  padding: "6px 18px",
                  background: "rgba(196, 98, 122, 0.3)",
                  borderRadius: 999,
                  fontSize: 22,
                  color: "#f9a8b4",
                  fontWeight: 700,
                  alignSelf: "flex-start",
                }}
              >
                {typeLabel[wine.type]} · {wine.country}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.1,
              marginTop: 24,
              maxWidth: 1000,
            }}
          >
            {wine.nameJa}
          </div>
          <div style={{ fontSize: 30, color: "#f9a8b4", marginTop: 20, maxWidth: 1000 }}>
            {wine.whyBuyNow.length > 80 ? wine.whyBuyNow.slice(0, 79) + "…" : wine.whyBuyNow}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 28, color: "white" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: "#D4A853", fontSize: 22 }}>価格</span>
            <span style={{ fontSize: 48, fontWeight: 900, color: "#C4627A" }}>¥{wine.price.toLocaleString()}</span>
          </div>
          {wine.vivinoScore && (
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ color: "#D4A853", fontSize: 22 }}>Vivino</span>
              <span style={{ fontSize: 44, fontWeight: 900 }}>{wine.vivinoScore.toFixed(1)}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: "#D4A853", fontSize: 22 }}>コスパ</span>
            <span style={{ fontSize: 44, fontWeight: 900, color: "#86efac" }}>{wine.costPerformance}</span>
            <span style={{ fontSize: 22, color: "#9ca3af" }}>/100</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
