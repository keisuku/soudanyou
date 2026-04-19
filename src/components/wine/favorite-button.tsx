"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";

interface Props {
  wineId: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ wineId, className = "", size = "md" }: Props) {
  const { has, toggle } = useFavorites();
  const active = has(wineId);
  const cx =
    size === "sm"
      ? "w-8 h-8"
      : "w-10 h-10";
  const icon = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(wineId);
      }}
      aria-label={active ? "お気に入りから外す" : "お気に入りに追加"}
      aria-pressed={active}
      className={`${cx} rounded-full flex items-center justify-center transition-all active:scale-90 ${
        active
          ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300"
          : "bg-white/80 dark:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-300 backdrop-blur-sm"
      } ${className}`}
    >
      <Heart className={`${icon} ${active ? "fill-current" : ""}`} />
    </button>
  );
}
