import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CompareTray } from "@/components/wine/compare-tray";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://keisuku.github.io";

export const metadata: Metadata = {
  title: {
    default: "ご近所ワイン | 今買うべきワインがすぐわかる",
    template: "%s | ご近所ワイン",
  },
  description:
    "コンビニ・スーパーで買えるワインをコスパと話題度で厳選。AIソムリエがあなたに合う1本を提案します。",
  metadataBase: new URL(siteUrl),
  applicationName: "ご近所ワイン",
  authors: [{ name: "soudanyou" }],
  keywords: [
    "ワイン",
    "コンビニワイン",
    "スーパーワイン",
    "コスパワイン",
    "AIソムリエ",
    "Vivino",
    "赤ワイン",
    "白ワイン",
    "スパークリングワイン",
  ],
  openGraph: {
    title: "ご近所ワイン",
    description:
      "コンビニ・スーパーで買えるワインをコスパと話題度で厳選。AIソムリエがあなたに合う1本を提案します。",
    type: "website",
    locale: "ja_JP",
    siteName: "ご近所ワイン",
  },
  twitter: {
    card: "summary_large_image",
    title: "ご近所ワイン",
    description:
      "コンビニ・スーパーで買えるワインをコスパと話題度で厳選。AIソムリエがあなたに合う1本を提案します。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFAF6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0a0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "system-ui, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif" }}
      >
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <CompareTray />
        <MobileBottomNav />
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
