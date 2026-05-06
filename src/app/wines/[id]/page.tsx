import Link from "next/link";
import { notFound } from "next/navigation";
import { CompactPostCard, WineCard } from "@/components/buzzwine";
import { getWineById } from "@/lib/wines";
import { pickPrimaryTweetUrl } from "@/lib/tweets";

export default async function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wine = await getWineById(id);
  if (!wine) notFound();
  const tweetUrl = pickPrimaryTweetUrl(wine.tweetUrls);
  return <main className="bg-[#FCFAF8] min-h-screen p-6"><div className="mx-auto max-w-5xl space-y-6"><Link href="/" className="text-sm">← トップへ</Link><h1 className="text-4xl font-black">ワイン詳細</h1><WineCard wine={wine} />{tweetUrl && <><h2 className="text-2xl font-black">Xで話題の投稿</h2><CompactPostCard tweetUrl={tweetUrl} /></>}</div></main>;
}
