import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase接続時は動的レンダリングを使うためexportモードは無効化
  // output: "export",
  basePath: "/soudanyou",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
