import { mockTweets, mockTrends } from "@/lib/mock-data";
import { TweetCard } from "@/components/trends/tweet-card";
import { TrendList } from "@/components/trends/trend-list";

export default function TrendsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">最新のワイントレンド</h1>
      <p className="text-muted-foreground mb-8">
        SNSで話題のワイン情報をリアルタイムでチェック
      </p>

      {/* Trend List */}
      <div className="mb-10">
        <TrendList trends={mockTrends} />
      </div>

      {/* Tweets Grid */}
      <h2 className="text-2xl font-semibold mb-4">最新のツイート</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
