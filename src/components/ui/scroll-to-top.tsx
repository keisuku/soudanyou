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
      className={`fixed ${bottomOffset} left-5 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-neutral-700 transition-all active:scale-95 ${className}`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
