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
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const tweetId = tweetUrl.split("/status/")[1]?.split("?")[0] ?? "";

  useEffect(() => {
    if (!ref.current || !tweetId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    const render = () => {
      if (window.twttr && ref.current) {
        ref.current.innerHTML = "";
        window.twttr.widgets
          .createTweet(tweetId, ref.current, { lang: "ja", dnt: "true" })
          .then((el) => {
            if (cancelled) return;
            setStatus(el ? "loaded" : "error");
          })
          .catch(() => {
            if (!cancelled) setStatus("error");
          });
      }
    };

    if (window.twttr) {
      render();
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.twttr) {
          clearInterval(interval);
          render();
        } else if (attempts > 20) {
          clearInterval(interval);
          if (!cancelled) setStatus("error");
        }
      }, 500);
      return () => { cancelled = true; clearInterval(interval); };
    }

    return () => { cancelled = true; };
  }, [tweetId]);

  // Hide completely if tweet fails to load
  if (status === "error") return null;

  return (
    <div>
      {status === "loading" && (
        <div className="flex h-24 items-center justify-center rounded-xl border border-border bg-secondary/30">
          <span className="text-xs text-muted-foreground">読み込み中...</span>
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}
