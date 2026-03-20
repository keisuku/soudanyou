"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          id: string,
          el: HTMLElement,
          options?: Record<string, string>
        ) => Promise<HTMLElement | undefined>;
      };
    };
  }
}

interface TweetEmbedProps {
  tweetUrl: string;
}

export function TweetEmbed({ tweetUrl }: TweetEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const tweetId = tweetUrl.split("/status/")[1]?.split("?")[0] ?? "";

  useEffect(() => {
    if (!ref.current || !tweetId) return;

    const render = () => {
      if (window.twttr && ref.current) {
        ref.current.innerHTML = "";
        window.twttr.widgets
          .createTweet(tweetId, ref.current, { lang: "ja", dnt: "true" })
          .then(() => setLoading(false));
      }
    };

    if (window.twttr) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.twttr) {
          clearInterval(interval);
          render();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [tweetId]);

  return (
    <div>
      {loading && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-secondary/30">
          <span className="text-sm text-muted-foreground">
            ツイートを読み込み中...
          </span>
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}
