"use client";

import type { Tweet } from "@/types/wine";
import { Heart, Repeat2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}日前`;
}

function highlightKeywords(content: string, keywords: string[]): React.ReactNode {
  if (keywords.length === 0) return content;

  const pattern = new RegExp(
    `(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}|#\\S+)`,
    "g"
  );
  const parts = content.split(pattern);

  return parts.map((part, i) => {
    if (pattern.test(part)) {
      return (
        <span key={i} className="font-semibold text-gold">
          {part}
        </span>
      );
    }
    // Reset regex lastIndex since we use `g` flag
    pattern.lastIndex = 0;
    return part;
  });
}

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardContent className="p-4">
        {/* Author row */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
            {tweet.authorName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {tweet.authorName}
            </p>
            <p className="text-xs text-muted-foreground">{tweet.authorHandle}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {relativeTime(tweet.createdAt)}
          </span>
        </div>

        {/* Content */}
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {highlightKeywords(tweet.content, tweet.wineRelated)}
        </p>

        {/* Engagement */}
        <div className="mt-3 flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="h-4 w-4" />
            {tweet.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Repeat2 className="h-4 w-4" />
            {tweet.retweets.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
