import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 68,
          fontWeight: 900,
          color: "white",
          background: "linear-gradient(135deg, #8B1A2B, #C4627A)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        BW
      </div>
    ),
    { ...size },
  );
}
