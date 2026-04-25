"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          id: string,
          el: HTMLElement,
          options?: Record<string, string>,
        ) => Promise<HTMLElement | undefined>;
      };
    };
  }
}

let twitterWidgetsPromise: Promise<Window["twttr"] | undefined> | null = null;

function loadTwitterWidgets(): Promise<Window["twttr"] | undefined> {
  if (typeof window === "undefined") return Promise.resolve(undefined);
  if (window.twttr) return Promise.resolve(window.twttr);
  if (twitterWidgetsPromise) return twitterWidgetsPromise;

  twitterWidgetsPromise = new Promise((resolve) => {
    const finish = () => resolve(window.twttr);
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", finish, { once: true });
      existingScript.addEventListener("error", () => resolve(undefined), { once: true });
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = finish;
      script.onerror = () => resolve(undefined);
      document.body.appendChild(script);
    }

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.twttr) {
        window.clearInterval(interval);
        finish();
      } else if (attempts > 60) {
        window.clearInterval(interval);
        resolve(undefined);
      }
    }, 250);
  });

  return twitterWidgetsPromise;
}

interface TweetEmbedProps {
  tweetUrl: string;
}

export function TweetEmbed({ tweetUrl }: TweetEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tweetId = tweetUrl.match(/\/status(?:es)?\/(\d+)/)?.[1] ?? "";
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    tweetId ? "loading" : "error",
  );

  useEffect(() => {
    if (!ref.current || !tweetId) return;

    let cancelled = false;
    ref.current.innerHTML = "";

    loadTwitterWidgets()
      .then((twttr) => {
        if (cancelled || !ref.current || !twttr) {
          if (!cancelled) setStatus("error");
          return undefined;
        }
        return twttr.widgets.createTweet(tweetId, ref.current, {
          align: "center",
          conversation: "none",
          dnt: "true",
          lang: "ja",
        });
      })
      .then((el) => {
        if (cancelled) return;
        setStatus(el ? "loaded" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [tweetId]);

  if (status === "error") {
    return (
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[220px] items-center justify-center rounded-lg border border-stone-200 bg-white p-5 text-center shadow-sm transition hover:border-stone-300"
      >
        <div>
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white">
            X
          </div>
          <p className="text-sm font-black text-stone-950">X投稿を開く</p>
          <p className="mt-1 break-all text-xs font-medium text-stone-500">{tweetUrl}</p>
        </div>
      </a>
    );
  }

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
