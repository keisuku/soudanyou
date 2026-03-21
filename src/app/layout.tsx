import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "ご近所ワイン | 今買うべきワインがすぐわかる",
  description: "コンビニ・スーパーで買えるワインをコスパと話題度で厳選",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
