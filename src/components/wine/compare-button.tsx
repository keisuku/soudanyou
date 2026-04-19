"use client";

import { Trophy, Check } from "lucide-react";
import { useCompareList, COMPARE_MAX } from "@/lib/compare-list";

interface Props {
  wineId: string;
  className?: string;
}

export function CompareButton({ wineId, className = "" }: Props) {
  const { has, toggle, isFull } = useCompareList();
  const active = has(wineId);
  const disabled = !active && isFull;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(wineId);
      }}
      disabled={disabled}
      aria-label={active ? "比較リストから外す" : "比較リストに追加"}
      aria-pressed={active}
      title={
        disabled
          ? `比較は最大${COMPARE_MAX}本まで`
          : active
          ? "比較リストから外す"
          : "比較リストに追加"
      }
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-[40px] border ${
        active
          ? "bg-gold text-background border-gold"
          : disabled
          ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
          : "bg-card text-foreground border-border hover:bg-muted"
      } ${className}`}
    >
      {active ? <Check className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
      {active ? "比較リスト追加済" : "比較に追加"}
    </button>
  );
}
