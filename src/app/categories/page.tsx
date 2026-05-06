import { wines, storeLabels } from "@/lib/wines";

const cats = ["焼肉", "チーズ", "魚介", "パスタ"];

export default function CategoriesPage() {
  return <main className="bg-[#FCFAF8] min-h-screen p-6"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-black mb-6">料理カテゴリー導線</h1><div className="grid md:grid-cols-2 gap-4">{cats.map((cat) => <section key={cat} className="rounded-3xl border border-[#E7E2DE] bg-white p-6"><h2 className="text-2xl font-bold mb-3">{cat}</h2><ul className="space-y-2 text-sm text-[#555]">{wines.filter((w) => w.pairings.includes(cat)).slice(0, 4).map((w) => <li key={w.id}>{w.nameJa} / {(w.stores[0] ? (storeLabels[w.stores[0].type] ?? w.stores[0].name) : "店舗情報なし")}</li>)}</ul></section>)}</div></div></main>;
}
