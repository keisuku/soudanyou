"use client";

import { useEffect, useRef, useState } from "react";
import { TweetEmbed } from "./tweet-embed";

interface LazyTweetEmbedProps {
  tweetUrl: string;
}

export function LazyTweetEmbed({ tweetUrl }: LazyTweetEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[220px]">
      {visible ? <TweetEmbed tweetUrl={tweetUrl} /> : null}
    </div>
  );
}
