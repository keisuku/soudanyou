import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Gokinjo Buzz Wine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A0A10 0%, #3D1225 50%, #1A0A10 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 50%, #8B1A2B 0%, transparent 50%), radial-gradient(circle at 70% 50%, #C4627A 0%, transparent 50%)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            display: "flex",
            width: 180,
            height: 180,
            alignItems: "center",
            justifyContent: "center",
            border: "5px solid #D4A853",
            borderRadius: 999,
            color: "#D4A853",
            fontSize: 72,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          BW
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: -2,
            display: "flex",
            gap: 20,
          }}
        >
          <span style={{ color: "#fff" }}>GOKINJO</span>
          <span
            style={{
              background: "linear-gradient(90deg, #C4627A, #D4A853)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            BUZZ WINE
          </span>
        </div>
        <div style={{ fontSize: 32, color: "#f9a8b4", marginTop: 24, fontWeight: 500 }}>
          Find the wine everyone is talking about.
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 32,
            fontSize: 22,
            color: "#d4a853",
          }}
        >
          <span>82 bottles</span>
          <span>Buzz proof</span>
          <span>Value picks</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
