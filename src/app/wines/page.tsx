import { WineCard } from "@/components/buzzwine";
import { wines } from "@/lib/wines";

export default function WinesPage() {
  return <main className="bg-[#FCFAF8] min-h-screen p-6"><div className="mx-auto max-w-7xl"><h1 className="text-4xl font-black mb-6">ワインカード一覧</h1><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{wines.slice(0, 16).map((wine) => <WineCard key={wine.id} wine={wine} />)}</div></div></main>;
}
