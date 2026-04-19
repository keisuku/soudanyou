"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface Props {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, url, className = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  async function share() {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const data: ShareData = { title, url: shareUrl };
    if (text) data.text = text;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user cancelled or share not possible — fall through to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        // ignore
      }
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="シェア"
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted min-h-[40px] ${className}`}
    >
      {status === "copied" ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          コピーしました
        </>
      ) : (
        <>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
            <Share2 className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          シェア
        </>
      )}
    </button>
  );
}
