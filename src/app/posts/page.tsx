import { CompactPostCard } from "@/components/buzzwine";
import { wines } from "@/lib/wines";
import { pickPrimaryTweetUrl } from "@/lib/tweets";

export default function PostsPage() {
  const entries = wines.map((w) => pickPrimaryTweetUrl(w.tweetUrls)).filter((v): v is string => Boolean(v)).slice(0, 16);
  return <main className="bg-[#FCFAF8] min-h-screen p-6"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-black mb-6">投稿風カード一覧</h1><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{entries.map((url) => <CompactPostCard key={url} tweetUrl={url} />)}</div></div></main>;
}
