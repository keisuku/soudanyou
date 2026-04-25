"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface Props {
  showAfter?: number;
  className?: string;
  ariaLabel?: string;
  bottomOffset?: string;
}

export function ScrollToTop({
  showAfter = 600,
  className = "",
  ariaLabel = "ページ上部へ戻る",
  bottomOffset = "bottom-24 sm:bottom-24",
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > showAfter);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [showAfter]);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={ariaLabel}
      className={`fixed ${bottomOffset} right-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-lg backdrop-blur transition-all hover:bg-white active:scale-95 sm:flex dark:bg-neutral-800/90 dark:text-gray-300 dark:hover:bg-neutral-700 ${className}`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
