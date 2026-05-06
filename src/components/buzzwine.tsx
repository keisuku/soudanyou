import Link from "next/link";
import { wines as sourceWines, storeLabels } from "@/lib/wines";
import { pickPrimaryTweetUrl } from "@/lib/tweets";
import { LazyTweetEmbed } from "@/components/wine/lazy-tweet-embed";
import type { Wine } from "@/types/wine";

const palette = {
  bg: "#FCFAF8",
  primary: "#8B0D2F",
  border: "#E7E2DE",
};

const topWines = sourceWines.slice(0, 16);
const featuredWine = topWines[0];

const yen = (v: number) => `¥${v.toLocaleString("ja-JP")}`;
const storeNames = (wine: Wine) => wine.stores.slice(0, 3).map((s) => storeLabels[s.type] ?? s.name);

function ImageBox({ hint }: { hint: string }) {
  return <div className="h-44 w-full rounded-2xl border bg-gradient-to-br from-[#f6efe9] to-[#fff] p-4 text-sm text-[#555]" style={{ borderColor: palette.border }}>{hint} 画像差し替え枠</div>;
}

export function WineCard({ wine }: { wine: Wine }) {
  return <article className="rounded-3xl bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border space-y-3" style={{ borderColor: palette.border }}><ImageBox hint={wine.nameJa} /><h3 className="text-xl font-bold text-[#111]">{wine.nameJa}</h3><p className="text-sm text-[#555]">{wine.country} / {wine.region ?? "-"}</p><p className="font-semibold text-[#1F8A5B]">{yen(wine.price)}</p><p className="text-sm">買える店舗: {storeNames(wine).join(" / ")}</p><p className="text-sm">バズ度 {wine.buzzScore} ・ 評価 {wine.vivinoScore ?? "-"}</p><p className="text-sm">合う料理: {wine.pairings.slice(0, 3).join("・")}</p><p className="text-sm text-[#555]">{wine.whyBuyNow}</p><Link href={`/wines/${wine.id}`} className="inline-block rounded-full px-4 py-2 text-sm font-bold text-white" style={{ background: palette.primary }}>詳細を見る</Link></article>;
}

export function CompactPostCard({ tweetUrl }: { tweetUrl: string }) {
  return <article className="rounded-3xl border bg-white p-3" style={{ borderColor: palette.border }}><div className="rounded-2xl overflow-hidden"><LazyTweetEmbed tweetUrl={tweetUrl} className="min-h-[180px]" contentClassName="[&_.twitter-tweet]:!my-0 [&_.twitter-tweet]:scale-[0.94] [&_.twitter-tweet]:origin-top" /></div></article>;
}

export function LandingPage() {
  const postWines = topWines.filter((w) => pickPrimaryTweetUrl(w.tweetUrls)).slice(0, 6);
  return <main style={{ background: palette.bg }} className="text-[#111]"><header className="sticky top-0 z-10 border-b backdrop-blur bg-[#FCFAF8]/95" style={{ borderColor: palette.border }}><div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap items-center gap-3"><p className="text-xl font-black">ご近所バズワイン</p><nav className="text-sm flex gap-4"><a>ランキング</a><a>近くで買える</a><a>料理で選ぶ</a><a>特集</a></nav><input placeholder="ワイン名・料理・お店で検索" className="ml-auto rounded-full border px-4 py-2 min-w-64" style={{ borderColor: palette.border }} /><a className="text-sm">お気に入り</a><a className="text-sm">マイページ</a></div></header>
  <section className="mx-auto max-w-7xl px-4 py-12 grid gap-8 lg:grid-cols-2"><div className="space-y-5"><h1 className="text-5xl font-black leading-tight">帰りに買える、<br />バズワイン。</h1><p className="text-[#555]">Xで話題の“おいしい1本”を、価格・買える店・料理相性まで整理。コンビニ、スーパー、近所の酒屋から、今夜の1本がすぐ見つかります。</p><div className="flex flex-wrap gap-2">{["焼肉", "チーズ", "魚介", "パスタ"].map((v) => <span key={v} className="rounded-full border px-4 py-2" style={{ borderColor: palette.border }}>{v}</span>)}</div><div className="flex flex-wrap gap-2">{["近くで買える", "Xで話題", "1,500円以下"].map((v) => <span key={v} className="rounded-full text-white px-4 py-2 text-sm" style={{ background: palette.primary }}>{v}</span>)}</div></div><div className="space-y-4"><WineCard wine={featuredWine} />{pickPrimaryTweetUrl(featuredWine.tweetUrls) && <CompactPostCard tweetUrl={pickPrimaryTweetUrl(featuredWine.tweetUrls)!} />}</div></section>
  <section className="mx-auto max-w-7xl px-4 py-6"><h2 className="text-3xl font-black mb-4">今日のバズワイン BEST 3</h2><div className="grid md:grid-cols-3 gap-4">{topWines.slice(0, 3).map((w) => <WineCard key={w.id} wine={w} />)}</div></section>
  <section className="mx-auto max-w-7xl px-4 py-6"><h2 className="text-3xl font-black mb-4">Xで話題の投稿</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{postWines.map((w) => { const url = pickPrimaryTweetUrl(w.tweetUrls); return url ? <CompactPostCard key={w.id} tweetUrl={url} /> : null; })}</div></section>
  <section className="mx-auto max-w-7xl px-4 py-6"><h2 className="text-3xl font-black mb-4">近くで買える人気ワイン一覧</h2><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{topWines.map((w) => <WineCard key={w.id} wine={w} />)}</div></section>
  <footer className="border-t py-8 text-center text-sm text-[#555]" style={{ borderColor: palette.border }}>© ご近所バズワイン</footer></main>;
}
