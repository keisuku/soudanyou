"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";

interface Props {
  className?: string;
  label?: string;
  href?: string;
}

export function FavoritesIndicator({
  className = "",
  label = "お気に入り",
  href = "/favorites",
}: Props) {
  const { count } = useFavorites();
  return (
    <Link
      href={href}
      aria-label={`${label} (${count}件)`}
      className={`relative inline-flex items-center justify-center rounded-xl transition-colors ${className}`}
    >
      <Heart className={`w-5 h-5 ${count > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
