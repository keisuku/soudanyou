"use client";

import { useEffect, useRef, useState } from "react";
import { TweetEmbed } from "./tweet-embed";

interface LazyTweetEmbedProps {
  tweetUrl: string;
  className?: string;
  contentClassName?: string;
}

export function LazyTweetEmbed({ tweetUrl, className, contentClassName }: LazyTweetEmbedProps) {
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
    <div ref={ref} className={className ?? "min-h-[220px]"}>
      {visible ? (
        contentClassName ? (
          <div className={contentClassName}>
            <TweetEmbed tweetUrl={tweetUrl} />
          </div>
        ) : (
          <TweetEmbed tweetUrl={tweetUrl} />
        )
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-stone-200 bg-white p-5 text-center shadow-sm">
          <div>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white">
              X
            </div>
            <p className="text-sm font-black text-stone-950">X投稿を読み込み中...</p>
            <p className="mt-1 text-xs font-medium text-stone-500">表示後、そのまま詳細ページへ進めます</p>
          </div>
        </div>
      )}
    </div>
  );
}
