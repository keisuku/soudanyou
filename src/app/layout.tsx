import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "ご近所ワイン | 今買うべきワインがすぐわかる",
  description: "コンビニ・スーパーで買えるワインをコスパと話題度で厳選",
  metadataBase: new URL("https://keisuku.github.io"),
  openGraph: {
    title: "ご近所ワイン",
    description: "コンビニ・スーパーで買えるワインをコスパと話題度で厳選。AIソムリエがあなたに合う1本を提案します。",
    type: "website",
    locale: "ja_JP",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A0A10",
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
        <main className="flex-1">{children}</main>
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
