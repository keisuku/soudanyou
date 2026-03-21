"use client";

import { TweetEmbed } from "@/components/wine/tweet-embed";

interface StoreTweetsProps {
  storeName: string;
  tweetUrls: string[];
}

export function StoreTweets({ storeName, tweetUrls }: StoreTweetsProps) {
  if (tweetUrls.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="mb-2 text-sm font-medium text-muted-foreground">
        {storeName}でワインを買った人の声
      </p>
      <div className="space-y-3">
        {tweetUrls.map((url) => (
          <TweetEmbed key={url} tweetUrl={url} />
        ))}
      </div>
    </div>
  );
}
