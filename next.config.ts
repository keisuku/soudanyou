import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/soudanyou",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
